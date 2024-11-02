import dayjs from 'dayjs';

/**
 * 是否是有效的日期
 *
 * @param {Date} date - The date to check.
 * @return {boolean} True if the date is valid, false otherwise.
 */
export const isValidDate = (date: Date): boolean => {
  if (date instanceof Date) {
    return !Number.isNaN(date.getTime()); // valueOf() 也可以
  }
  return false;
};

/**
 * 能否使用 dayjs 转换成 Date
 *
 * @param {Date | string | number | null | undefined} date - The date to be checked.
 * @return {boolean} Returns true if the date can be converted to a valid Date object, otherwise returns false.
 */
export const canBeConvertToDate = (
  date?: Date | string | number | null,
): boolean => {
  if (date === undefined || date === null || date === '') {
    return false;
  }
  const convertedDate = dayjs(date);
  return convertedDate.isValid();
};

/**
 * 转换日期
 *
 * @param {Date | string | number | null | undefined} date - The date to format.
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - The format string to use.
 * @return {string} The formatted date string.
 */
export const formatDate = (
  date: Date | string | number | null | undefined,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string => {
  if (date === undefined || date === null || date === '') {
    return '--';
  }
  const convertedDate = dayjs(date);
  if (!convertedDate.isValid()) {
    return '--';
  }

  return convertedDate.format(format);
};
