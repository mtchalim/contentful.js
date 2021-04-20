import { EntryFields } from '../entry'
import { ConditionalQueries } from './util'

type SupportedTypes =
  | EntryFields.Symbol
  | EntryFields.Text
  | EntryFields.Integer
  | EntryFields.Number
  | EntryFields.Date
  | EntryFields.Boolean
  | EntryFields.Location
  | EntryFields.RichText
/**
 * @desc equality - search for exact matches
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/equality-operator}
 */
export type EqualityQueries<Fields, Prefix extends string> = ConditionalQueries<
  Fields,
  SupportedTypes,
  Prefix,
  ''
>

/**
 * @desc inequality - exclude matching items
 * @see [Documentation]{@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inequality-operator}
 */
export type InequalityQueries<Fields, Prefix extends string> = ConditionalQueries<
  Fields,
  SupportedTypes,
  Prefix,
  '[ne]'
>

// TODO: it still includes 'Link' fields