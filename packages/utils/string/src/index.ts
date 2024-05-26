import kebabCase from 'lodash/kebabCase'

/**
 * Returns the byte size of a string.
 * @param str String to get the byte size of.
 * @example
 * getByteSize('Hello World') // 11
 */
export const getByteSize = (str: string): number => new Blob([str]).size

/**
 * Converts string to command case (lower case and column separated string).
 * @example
 * ```ts
 * commandCase('Hello World') // 'hello:world'
 * commandCase('HelloWorld')  // 'hello:world'
 * commandCase('helloWorld')  // 'hello:world'
 * ```
 * @param str String to convert.
 * @returns String as command case.
 */
export const commandCase = (str: string) => kebabCase(str).replace(/-/g, ':')

/**
 * Converts string to slug used in URLs.
 * @param str String to convert.
 * @returns String as slug.
 * @example
 * ```ts
 * slugify('Hello World') // 'hello-world'
 * slugify('HelloWorld')  // 'helloworld'
 * slugify('helloWorld')  // 'helloworld'
 * ```
 */
export const slugify = (str: string) => str
  .toString()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w-]+/g, '')
  .replace(/--+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '')
