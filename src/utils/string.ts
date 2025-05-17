/**
 * Parse a string to humanize read
 * e.g.
 *  'not-humanized_string' => 'not humanized string'
 *  'notHumanizedString' => 'not Humanized String'
 * @param str
 */
import upperFirst from 'lodash/upperFirst';

export const humanize = (str: string): string =>
    str
        .trim()
        .replace(/[_-]/g, ' ')
        .replace(/[a-z]([A-Z]+)/g, ' $1');

export const upperFirstHumanize = (str: string): string => upperFirst(humanize(str));

export const toUrlQuery = (str: string): string => str.replace(/ /g, '-').toLowerCase();

export const hyphenToUnderscore = (str: string): string => str.replace(/-/g, '_');

/**
 * get first name from full name
 * @param name full Name
 * @returns first name
 */
export const getFirstName = (name: string): string => {
    const [firstName] = name.split(' ');
    return firstName;
};

/**
 * get last name from full name
 * @param name full Name
 * @returns first name
 */
export const getLastName = (name: string): string => {
    const [, ...lastName] = name.split(' ');
    return lastName.join(' ');
};

/**
 * get first name and last name from full name
 * @param name full Name
 * @returns [first name, last name]
 */
export const getFirstNameAndLastName = (name: string): [string, string] => {
    const [firstName, ...lastName] = name.split(' ');
    return [firstName, lastName.join(' ')];
};
