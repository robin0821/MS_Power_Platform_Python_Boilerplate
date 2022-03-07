#!python
'''
Copyright 2021 Vale

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*** You can contribute to the main repository at: ***

https://github.com/pemn/pycds
---------------------------------
'''


import os.path
import msal
from urllib.parse import parse_qsl, urlparse
from requests import request
import win32clipboard
import pandas as pd
import base64
from cryptography.fernet import Fernet
import uuid
import json


def oauth2_nativeclient_driver(consent_url):
  from selenium import webdriver
  from selenium.webdriver.support.ui import WebDriverWait
  from selenium.webdriver.support import expected_conditions
  print("new session")
  driver = webdriver.Chrome(executable_path="../web_driver/chromedriver.exe")
  driver.get(consent_url)
  wait = WebDriverWait(driver, 600)
  wait.until(expected_conditions.url_contains('code='))
  authenticated_url = driver.current_url
  driver.quit()
  return authenticated_url

NEXTLINK = '@odata.nextLink'

class DataverseClient(object):
  _a = None
  _c = None
  _ti = ''
  _ci = ''
  _ru = ''
  def __init__(self, settings='dataverse_settings.json'):
    if os.path.exists(settings):
      s = json.load(open(settings))
      # azure tenant id of your organization. found in account info.
      self._ti = s['ti']
      # cliend id of azure application.
      # create one in azure portal if needed.
      self._ci = s['ci']
      # crm address of the Dataverse of your corporation.
      # Ex.: https://orgxx123456.crm.dynamics.com/
      self._ru = s['ru']
    # hardcoded settings
    self._authority = 'https://login.microsoftonline.com/' + self._ti
    self._api = "api/data/v9.2"
    self._tcsf = "dataverse_msal_token_cache.bin"
    self._tc = msal.SerializableTokenCache()
    self._redirect = 'https://localhost:8000'
    self._scope = [self._ru + '/.default']

    # symmetric cryptography engine for token store
    # local unique node id is used as key
    # decoding is possible to anyone with filesystem
    # and execute access to where the store was created!
    key = uuid.getnode().to_bytes(32, 'big')
    self._f = Fernet(base64.urlsafe_b64encode(key))


  def authenticate(self):
    self.load_token_cache()

    self._a = msal.ClientApplication(self._ci, authority=self._authority, token_cache=self._tc)
 
    token = None
    for acc in self._a.get_accounts():
      token = self._a.acquire_token_silent(self._scope, acc)
      #print(token)
      if token:
        print("using cache token")
        break
    else:
      print("request new token")
      #token = self.auth_flow_copy()
        
    token = self.auth_flow_auto()


    self._headers = {"Authorization": "Bearer " + token['access_token']}

  def auth_flow_auto(self):
    flow = self._a.initiate_auth_code_flow(self._scope, self._redirect)
    code = oauth2_nativeclient_driver(flow['auth_uri'])

    return self.auth_flow_save(flow, code)

  def auth_flow_copy(self):
    flow = self._a.initiate_auth_code_flow(self._scope, self._redirect)

    win32clipboard.OpenClipboard()
    win32clipboard.EmptyClipboard()
    win32clipboard.SetClipboardText(flow['auth_uri'])
    win32clipboard.CloseClipboard()
    print(flow['auth_uri'])
    code = input()
    if len(code) == 0:
      win32clipboard.OpenClipboard()
      code = win32clipboard.GetClipboardData()
      win32clipboard.CloseClipboard()

    return self.auth_flow_save(flow, code)

  def auth_flow_save(self, flow, code):
    auth_response = dict(parse_qsl(urlparse(code).query))
    #print(auth_response)
    token = self._a.acquire_token_by_auth_code_flow(flow, auth_response)

    self.save_token_cache()
    print(token)
    
    return token

  def save_token_cache(self):
    step1 = bytes(self._tc.serialize(), 'utf-8')
    step2 = self._f.encrypt(step1)
    open(self._tcsf, "wb").write(step2)
        
  def load_token_cache(self):
    if os.path.exists(self._tcsf):
      step1 = open(self._tcsf, "rb").read()
      try:
        step2 = self._f.decrypt(step1)
        self._tc.deserialize(step2)
      except:
        pass

  def whoami(self):
    return self.make_request('WhoAmI')

  def make_request(self, endpoint, query = '', method = 'get', data = None, uri = None):
    
    if method != 'delete':
      uri = '?'
    elif uri is None:
      raise Exception("delete requires a resource id")
      return

    url = '{0}{1}/{2}{3}{4}'.format(self._ru, self._api, endpoint, uri, query)
    #, data=data, json=json
    #response = request(method, url, headers=self._headers, data=data)
    response = request(method, url, headers=self._headers, json=data)
    print(method,url,response.status_code,response.reason)
    #if response.status_code // 100 == 2:
    if response.ok:
      if len(response.text):
        return response.json()

    return None

  def get(self, endpoint, query = '', df = None):
    data = self.make_request(endpoint, query)
    if df is None:
      df = pd.DataFrame()
    if data is not None:
      if 'value' in data:
        df = df.append(pd.DataFrame.from_records(data['value']))
      if NEXTLINK in data:
        query = urlparse(data[NEXTLINK]).query
        return self.get(endpoint, query, df)
    
    return(df)

  def post(self, endpoint, data):
    print("post", endpoint)
    print(data)
    self.make_request(endpoint, '', 'post', data)

  def delete(self, endpoint, eid):
    self.make_request(endpoint, '', 'delete', uri = '({0})'.format(eid))

  def upload_df(self, endpoint, df):
    rd = dict(map(lambda _: (_, 'crfbc_' + _), df.columns))
    df.rename(columns=rd, inplace=True)
    for ri,rd in df.iterrows():
      self.post(endpoint, rd.to_json())
  
  def upload_df_string(self, endpoint, df):
    at = {}
    for i in range(df.shape[1]):
      # convert int64 to string
      if df.dtypes[i].num == 9:
        at[df.columns[i]] = 'string'
    df = df.astype(at)
    self.upload_df(endpoint, df)

  def delete_df(self, endpoint, df):
    # remove the automatic S from endpoint and add ID
    eid_column = endpoint[:-1] + 'id'
    if not eid_column in df:
      print(eid_column, "not found")
      return

    for ri,rd in df.iterrows():
      self.delete(endpoint, rd[eid_column])
