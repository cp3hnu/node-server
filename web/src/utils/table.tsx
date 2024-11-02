/*
 * @Author: 赵伟
 * @Date: 2024-06-26 10:05:52
 * @Description: Table cell 自定义 render
 */

import { formatDate } from '@/utils/date';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';

export enum TableCellValueType {
  Index = 'Index',
  Text = 'Text',
  Date = 'Date',
  Array = 'Array',
  Link = 'Link',
  Custom = 'Custom',
}

export type TableCellValueOptions<T> = {
  page?: number; // 类型为 Index 时有效
  pageSize?: number; // 类型为 Index 时有效
  property?: string; // 类型为 Array 时有效
  dateFormat?: string; // 类型为 Date 时有效
  onClick?: (record: T, e: React.MouseEvent) => void; // 类型为 Link 时有效
  format?: (
    value: any | undefined | null,
    record: T,
    index: number,
  ) => string | undefined | null; // 类型为 Custom 时有效
};

type TableCellFormatter = (
  value: any | undefined | null,
) => string | undefined | null;

// 日期转换函数
function formatDateText(dateFormat?: string): TableCellFormatter {
  return (value: any | undefined | null): ReturnType<TableCellFormatter> => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    if (!dayjs(value).isValid()) {
      return null;
    }
    return formatDate(value, dateFormat);
  };
}

/**
 * 数组转换函数，将数组元素转换为字符串，用逗号分隔
 * @param {string} property 如果数组元素是对象，那么取数组元素的某个属性
 * @returns {TableCellFormatter} Table cell 渲染函数
 */
function formatArray(property?: string): TableCellFormatter {
  return (value: any | undefined | null): ReturnType<TableCellFormatter> => {
    if (
      value === undefined ||
      value === null ||
      Array.isArray(value) === false ||
      value.length === 0
    ) {
      return null;
    }

    const list =
      property && typeof value[0] === 'object'
        ? value.map((item) => item[property])
        : value;
    return list.join(',');
  };
}

function tableCellRender<T>(
  ellipsis: boolean = false,
  type: TableCellValueType = TableCellValueType.Text,
  options?: TableCellValueOptions<T>,
) {
  return (value: any | undefined | null, record: T, index: number) => {
    let text = value;
    switch (type) {
      case TableCellValueType.Index:
        text = (options?.page ?? 0) * (options?.pageSize ?? 0) + index + 1;
        break;
      case TableCellValueType.Text:
      case TableCellValueType.Link:
        text = value;
        break;
      case TableCellValueType.Date:
        text = formatDateText(options?.dateFormat)(value);
        break;
      case TableCellValueType.Array:
        text = formatArray(options?.property)(value);
        break;
      case TableCellValueType.Custom:
        text = options?.format?.(value, record, index);
        break;
      default:
        break;
    }

    if (ellipsis && text) {
      return (
        <Tooltip
          title={text}
          placement="topLeft"
          overlayStyle={{ maxWidth: '400px' }}
        >
          {renderCell(
            text,
            type === TableCellValueType.Link,
            record,
            options?.onClick,
          )}
        </Tooltip>
      );
    } else {
      return renderCell(
        text,
        type === TableCellValueType.Link,
        record,
        options?.onClick,
      );
    }
  };
}

function renderCell<T>(
  text: any | undefined | null,
  isLink: boolean,
  record: T,
  onClick?: (record: T, e: React.MouseEvent) => void,
) {
  return isLink ? renderLink(text, record, onClick) : renderText(text);
}

function renderText(text: any | undefined | null) {
  return <span>{text ?? '--'}</span>;
}

function renderLink<T>(
  text: any | undefined | null,
  record: T,
  onClick?: (record: T, e: React.MouseEvent) => void,
) {
  return (
    <a className="kf-table-row-link" onClick={(e) => onClick?.(record, e)}>
      {text}
    </a>
  );
}

export default tableCellRender;
