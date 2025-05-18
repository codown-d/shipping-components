import React, { useState, useCallback } from 'react';
import {
  Card,
  Button,
  Icon,
  DataTable,
  Pagination,
  DatePicker,
} from '@shopify/polaris';
import { CalendarMajor, ArrowDownMinor } from '@shopify/polaris-icons';

import styles from './BillingCycle.module.scss';

export interface BillingCycleProps {
  onDownload?: (id: string, type: string) => void;
}

interface BillingRecord {
  id: string;
  type: 'Receipt' | 'Invoice' | 'Credit note';
  reportDate: string;
}

const BillingCycle: React.FC<BillingCycleProps> = ({
  onDownload,
}) => {
  // 状态管理
  const [selectedType, setSelectedType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState('October 18,2024-April 15,2025');
  const [popoverActive, setPopoverActive] = useState(false);
  const [typePopoverActive, setTypePopoverActive] = useState(false);
  const [{ month, year }, setDate] = useState({ month: 10, year: 2024 });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(2024, 9, 18),
    end: new Date(2025, 3, 15),
  });

  // 处理日期选择器
  const togglePopoverActive = useCallback(
    (e) => {
		e.stopPropagation();
		setPopoverActive((popoverActive) => !popoverActive);
	},
    [],
  );

  const toggleTypePopoverActive = useCallback(
    (e) => {
		e.stopPropagation();
		setTypePopoverActive((active) => !active);
	},
    [],
  );

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    [],
  );

  const handleDateSelection = useCallback(
    (range) => {
      setSelectedDates(range);
      if (range.end) {
        const startDate = range.start;
        const endDate = range.end;
        const formattedStartDate = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
        const formattedEndDate = `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;
        setDateRange(`${formattedStartDate}-${formattedEndDate}`);
        setPopoverActive(false);
      }
    },
    [],
  );

  const handleTypeSelection = useCallback(
    (value) => {
      setSelectedType(value);
      setTypePopoverActive(false);
    },
    [],
  );

  // 类型选项
  const typeOptions = [
    { label: 'All', value: 'All' },
    { label: 'Receipt', value: 'Receipt' },
    { label: 'Invoice', value: 'Invoice' },
    { label: 'Credit note', value: 'Credit note' },
  ];

  // 模拟数据
  const billingRecords: BillingRecord[] = [
    { id: 'CNUS202509001', type: 'Receipt', reportDate: '03/08/2025 - 03/15/2025' },
    { id: 'CNUS202509001', type: 'Invoice', reportDate: '03/08/2025 - 03/15/2025' },
    { id: 'CNUS202509001', type: 'Receipt', reportDate: '03/08/2025 - 03/15/2025' },
    { id: 'CNUS202509001', type: 'Credit note', reportDate: '03/08/2025 - 03/15/2025' },
    { id: 'CNUS202509001', type: 'Credit note', reportDate: '03/08/2025 - 03/15/2025' },
    { id: 'CNUS202509001', type: 'Receipt', reportDate: '03/08/2025 - 03/15/2025' },
    { id: 'CNUS202509001', type: 'Receipt', reportDate: '03/08/2025 - 03/15/2025' },
    { id: 'CNUS202509001', type: 'Receipt', reportDate: '03/08/2025 - 03/15/2025' },
    { id: 'CNUS202509001', type: 'Receipt', reportDate: '03/08/2025 - 03/15/2025' },
    { id: 'CNUS202509001', type: 'Receipt', reportDate: '03/08/2025 - 03/15/2025' },
  ];

  // 处理下载按钮点击
  const handleDownload = (id: string, type: string) => {
    if (onDownload) {
      onDownload(id, type);
    } else {
      console.log(`Downloading ${type} with ID: ${id}`);
    }
  };

  // 处理分页变化
  const handlePaginationChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 渲染表格行
  const rows = billingRecords.map((record) => [
    record.id,
    <div className={styles.typeCell}>
      <span className={styles.typeTag}>{record.type}</span>
    </div>,
    record.reportDate,
    <Button
      plain
      icon={ArrowDownMinor}
      onClick={() => handleDownload(record.id, record.type)}
      accessibilityLabel={`Download ${record.type}`}
    />
  ]);

  return (
	<div onClick={()=>setTypePopoverActive(false)} style={{background:"#FFFFFF"}}>

    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>Billing cycle</h2>
        <p className={styles.description}>
          Download receipts, invoices, and credit notes related to your account.
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.typeFilter}>
          <div className={styles.typeSelectWrapper}>
            <div className={styles.customTypeSelect} onClick={toggleTypePopoverActive}>
              <span className={styles.typeSelectLabel}>Type:</span>
              <span className={styles.typeSelectValue}>{selectedType}</span>
              <span className={styles.typeSelectIcon}>▼</span>
            </div>
            {typePopoverActive && (
              <div className={styles.typeSelectPopover}>
                <div className={styles.typeSelectOptions}>
                  {typeOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`${styles.typeSelectOption} ${selectedType === option.value ? styles.typeSelectOptionSelected : ''}`}
                      onClick={() => handleTypeSelection(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.dateFilter}>
          <div className={styles.dateFieldWrapper}>
            <div className={styles.customDatePicker} onClick={togglePopoverActive}>
              <Icon source={CalendarMajor} />
              <span className={styles.dateInlinePrefix}>Generation time:</span>
              <span className={styles.dateValue}>{dateRange}</span>
            </div>
            {popoverActive && (
              <div className={styles.datePickerPopover}>
                <DatePicker
                  month={month}
                  year={year}
                  onChange={handleDateSelection}
                  onMonthChange={handleMonthChange}
                  selected={selectedDates}
                  allowRange
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <DataTable
          columnContentTypes={['text', 'text', 'text', 'text']}
          headings={['ID', 'Type', 'Report date', '']}
          rows={rows}
        />
      </div>

      <div className={styles.pagination}>
        <Pagination
          hasPrevious={currentPage > 1}
          onPrevious={() => handlePaginationChange(currentPage - 1)}
          hasNext={currentPage < 10}
          onNext={() => handlePaginationChange(currentPage + 1)}
          label={`${currentPage} / 10`}
        />
      </div>
    </Card>
	</div>
  );
};

export default BillingCycle;
