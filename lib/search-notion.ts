// import ky from 'ky'
import ExpiryMap from 'expiry-map'
import fetch from 'isomorphic-unfetch'
import pMemoize from 'p-memoize'

import * as types from './types'
import { api } from './config'

export const searchNotion = pMemoize(searchNotionImpl, {
  cacheKey: (args) => args[0]?.query,
  cache: new ExpiryMap(10000)
})

async function searchNotionImpl(
  params: types.SearchParams
): Promise<types.SearchResults> {
  if (params.query === '') {
    return
  }
  console.log(JSON.stringify(params))
  return fetch(api.searchNotion, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then((res) => {
      console.log(res)
      if (res.ok) {
        return res
      }

      // convert non-2xx HTTP responses into errors
      const error: any = new Error(res.statusText)
      error.response = res
      return Promise.reject(error)
    })
    .then((res) => res.json())

  // return ky
  //   .post(api.searchNotion, {
  //     json: params
  //   })
  //   .json()
}
