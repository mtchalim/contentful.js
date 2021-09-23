/**
 * Contentful Delivery API Client. Contains methods which allow access to the
 * different kinds of entities present in Contentful (Entries, Assets, etc).
 */

import { AxiosInstance, createRequestConfig } from 'contentful-sdk-core'
import { GetGlobalOptions } from './create-global-options'
import pagedSync from './paged-sync'
import {
  Asset,
  AssetCollection,
  AssetFields,
  AssetQueries,
  ContentType,
  ContentTypeCollection,
  Entry,
  EntryCollection,
  EntryQueries,
  LocaleCollection,
  Space,
  SyncCollection
} from './types'
import { FieldsType } from './types/query/util'
import normalizeSelect from './utils/normalize-select'
import resolveCircular from './utils/resolve-circular'

export interface ContentfulClientApi {
  version: string

  /**
   * Gets an Asset
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const asset = await client.getAsset('<asset_id>')
   * console.log(asset)
   * ```
   */
  getAsset(id: string): Promise<Asset>

  /**
   * Gets a collection of Assets
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getAssets()
   * console.log(response.items)
   * ```
   */
  getAssets(query?: AssetQueries<AssetFields>): Promise<AssetCollection>

  /**
   * Gets a Content Type
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const contentType = await client.getContentType('<content_type_id>')
   * console.log(contentType)
   * ```
   */
  getContentType(id: string): Promise<ContentType>

  /**
   * Gets a collection of Content Types
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getContentTypes()
   * console.log(response.items)
   * ```
   */
  getContentTypes(): Promise<ContentTypeCollection>

  /**
   * Gets a collection of Entries
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getEntries()
   * .console.log(response.items)
   * ```
   */
  getEntries<Fields = FieldsType>(query?: EntryQueries<Fields>): Promise<EntryCollection<Fields>>

  /**
   * Gets an Entry
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const entry = await client.getEntry('<entry_id>')
   * console.log(entry)
   * ```
   */
  getEntry<Fields = FieldsType>(id: string, query?: EntryQueries<Fields>): Promise<Entry<Fields>>

  /**
   * Gets the Space which the client is currently configured to use
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   * // returns the space object with the above <space-id>
   * const space = await client.getSpace()
   * console.log(space)
   * ```
   */
  getSpace(): Promise<Space>

  /**
   * Gets a collection of Locale
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.getLocales()
   * console.log(response.items)
   * ```
   */
  getLocales(): Promise<LocaleCollection>

  /**
   * Parse raw json data into collection of entry objects.Links will be resolved also
   * @category API
   * @example
   * ```javascript
   * let data = {items: [
   *    {
   *    sys: {type: 'Entry', locale: 'en-US'},
   *    fields: {
   *      animal: {sys: {type: 'Link', linkType: 'Animal', id: 'oink'}},
   *      anotheranimal: {sys: {type: 'Link', linkType: 'Animal', id: 'middle-parrot'}}
   *    }
   *  }
   * ],
   * includes: {
   *  Animal: [
   *    {
   *      sys: {type: 'Animal', id: 'oink', locale: 'en-US'},
   *      fields: {
   *        name: 'Pig',
   *        friend: {sys: {type: 'Link', linkType: 'Animal', id: 'groundhog'}}
   *      }
   *    }
   *   ]
   *  }
   * }
   * console.log( data.items[0].fields.foo ); // undefined
   * let parsedData = client.parseEntries(data);
   * console.log( parsedData.items[0].fields.foo ); // foo
   * ```
   */
  parseEntries<T>(raw: any): EntryCollection<T>

  /**
   * Synchronizes either all the content or only new content since last sync
   * See <a href="https://www.contentful.com/developers/docs/concepts/sync/">Synchronization</a> for more information.
   * <strong> Important note: </strong> The the sync api endpoint does not support include or link resolution.
   * However contentful.js is doing link resolution client side if you only make an initial sync.
   * For the delta sync (using nextSyncToken) it is not possible since the sdk wont have access to all the data to make such an operation.
   * @category API
   * @example
   * ```javascript
   * const contentful = require('contentful')
   *
   * const client = contentful.createClient({
   *   space: '<space_id>',
   *   accessToken: '<content_delivery_api_key>'
   * })
   *
   * const response = await client.sync({
   *   initial: true
   * })
   * console.log({
   *   entries: response.entries,
   *   assets: response.assets,
   *   nextSyncToken: response.nextSyncToken
   * })
   * ```
   */
  sync(query: any): Promise<SyncCollection>
}

interface CreateContentfulApiParams {
  http: AxiosInstance
  getGlobalOptions: GetGlobalOptions
}

class NotFoundError extends Error {
  public readonly sys: { id: string; type: string }
  public readonly details: { environment: string; id: string; type: string; space: any }

  constructor(id: string, environment: string, space: string) {
    super('The resource could not be found.')
    this.sys = {
      type: 'Error',
      id: 'NotFound'
    }
    this.details = {
      type: 'Entry',
      id,
      environment,
      space
    }
  }
}

export default function createContentfulApi({
                                              http,
                                              getGlobalOptions
                                            }: CreateContentfulApiParams): ContentfulClientApi {
  const notFoundError = (id = 'unknown') => {
    return new NotFoundError(id, getGlobalOptions().environment, getGlobalOptions().space)
  }

  // eslint-disable-next-line no-undef
  function errorHandler(error): never {
    if (error.data) {
      throw error.data
    }

    if (error.response && error.response.data) {
      throw error.response.data
    }

    throw error
  }

  interface GetConfig {
    context: 'space' | 'environment'
    path: string
    config?: any
  }

  async function get<T>({ context, path, config }: GetConfig): Promise<T> {
    let baseUrl =
      context === 'space' ? getGlobalOptions().spaceBaseUrl : getGlobalOptions().environmentBaseUrl

    if (!baseUrl) {
      throw new Error('Please define baseUrl for ' + context)
    }

    if (!baseUrl.endsWith('/')) {
      baseUrl += '/'
    }

    try {
      const response = await http.get(baseUrl + path, config)
      return response.data
    } catch (error) {
      errorHandler(error)
    }
  }

  async function getSpace(): Promise<Space> {
    return get<Space>({ context: 'space', path: '' })
  }

  async function getContentType(id: string): Promise<ContentType> {
    return get<ContentType>({
      context: 'environment',
      path: `content_types/${id}`
    })
  }


  async function getContentTypes(): Promise<ContentTypeCollection> {
    return get<ContentTypeCollection>({
      context: 'environment',
      path: 'content_types',
      config: createRequestConfig({ query: {} })
    })
  }


  async function getEntry<Fields>(
    id: string,
    query: EntryQueries<Fields> = {}
  ): Promise<Entry<Fields>> {
    if (!id) {
      throw notFoundError(id)
    }
    try {
      const response = await this.getEntries({ 'sys.id': id, ...query })
      if (response.items.length > 0) {
        return response.items[0]
      } else {
        throw notFoundError(id)
      }
    } catch (error) {
      errorHandler(error)
    }
  }


  async function getEntries<Fields>(
    query: EntryQueries<Fields> = {}
  ): Promise<EntryCollection<Fields>> {
    const { resolveLinks, removeUnresolved } = getGlobalOptions({})
    try {
      const entries = await get({
        context: 'environment',
        path: 'entries',
        config: createRequestConfig({ query: normalizeSelect(query) })
      })
      return resolveCircular(entries, { resolveLinks, removeUnresolved })
    } catch (error) {
      errorHandler(error)
    }
  }


  async function getAsset(id: string, query = {}): Promise<Asset> {
    return get<Asset>({
      context: 'environment',
      path: `assets/${id}`,
      config: createRequestConfig({ query: normalizeSelect(query) })
    })
  }


  async function getAssets(query = {}): Promise<AssetCollection> {
    return get<AssetCollection>({
      context: 'environment',
      path: 'assets',
      config: createRequestConfig({ query: normalizeSelect(query) })
    })
  }


  async function getLocales(query = {}): Promise<LocaleCollection> {
    return get<LocaleCollection>({
      context: 'environment',
      path: 'locales',
      config: createRequestConfig({ query: normalizeSelect(query) })
    })
  }


  async function sync(query = {}, options = { paginate: true }) {
    const { resolveLinks, removeUnresolved } = getGlobalOptions(query)
    switchToEnvironment(http)
    return pagedSync(http, query, { resolveLinks, removeUnresolved, ...options })
  }

  function parseEntries(data) {
    const { resolveLinks, removeUnresolved } = getGlobalOptions({})
    return resolveCircular(data, { resolveLinks, removeUnresolved })
  }

  /*
   * Switches BaseURL to use /environments path
   * */
  function switchToEnvironment(http: AxiosInstance): void {
    http.defaults.baseURL = getGlobalOptions().environmentBaseUrl
  }

  return {
    // version: __VERSION__,
    version: 'test-0.0.0',
    getSpace: getSpace,
    getContentType: getContentType,
    getContentTypes: getContentTypes,
    getEntry: getEntry,
    getEntries: getEntries,
    getAsset: getAsset,
    getAssets: getAssets,
    getLocales: getLocales,
    parseEntries: parseEntries,
    sync: sync
  }
}
