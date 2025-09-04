# Base Price Recalculation Summary

## Overview

Recalculated base_price for each row in the CSV file based on the requirement that min_price should be 1.18 times the base_price.

**Formula used:** New base_price = min_price ÷ 1.18

## Changes Made

| Row | Item Name                 | Min Price | Old Base Price | New Base Price | Change  |
| --- | ------------------------- | --------- | -------------- | -------------- | ------- |
| 1   | Titan Aviator Classic     | 1999      | 1999           | 1694.07        | -304.93 |
| 2   | Titan Wayfarer Bold       | 2499      | 2499           | 2117.8         | -381.2  |
| 3   | Titan Round Tortoise      | 2299      | 2299           | 1948.31        | -350.69 |
| 4   | Vincent Chase Black       | 1799      | 1799           | 1524.58        | -274.42 |
| 5   | John Jacobs Gold Trim     | 2899      | 2899           | 2456.78        | -442.22 |
| 6   | Fossil Wayfarer           | 2599      | 2599           | 2202.54        | -396.46 |
| 7   | Fastrack Wrap Purple      | 1699      | 1699           | 1439.83        | -259.17 |
| 8   | Fastrack Clubmaster       | 2199      | 2199           | 1863.56        | -335.44 |
| 9   | Fastrack Hex Green        | 2399      | 2399           | 2033.05        | -365.95 |
| 10  | Wildcraft Wiki 3 Backpack | 1399      | 1499           | 1185.59        | -313.41 |
| 11  | Wildcraft Hypadura Bag    | 2499      | 2599           | 2117.8         | -481.2  |
| 12  | AT Ivy Backpack           | 1299      | 1399           | 1100.85        | -298.15 |
| 13  | AT Urban Groove Backpack  | 2199      | 2299           | 1863.56        | -435.44 |
| 14  | Safari Pentagon Backpack  | 899       | 999            | 761.86         | -237.14 |
| 15  | Safari Progear Backpack   | 1699      | 1799           | 1439.83        | -359.17 |

## Verification

For each row, the new base_price × 1.18 should equal the min_price:

- Row 1: 1694.07 × 1.18 = 1999.00 ✓
- Row 2: 2117.8 × 1.18 = 2499.00 ✓
- Row 3: 1948.31 × 1.18 = 2299.00 ✓
- And so on...

## Files Created

- `retail_items_dev_updated.csv` - Updated CSV file with recalculated base_price values
- `recalculate_base_price.py` - Python script used for the calculation

## Notes

- All base_price values have been rounded to 2 decimal places
- The relationship min_price = 1.18 × base_price is now maintained for all rows
- Original file remains unchanged as `retail_items_dev.csv`
- Updated file saved as `retail_items_dev_updated.csv`
