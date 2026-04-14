/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View } from 'react-native';

export type RulerPickerItemProps = {
  /**
   * Gap between steps
   *
   * @default 10
   */
  gapBetweenSteps: number;
  /**
   * Height of the short step
   *
   * @default 20
   */
  shortStepHeight: number;
  /**
   * Height of the long step
   *
   * @default 40
   */
  longStepHeight: number;
  /**
   * Width of the steps
   *
   * @default 2
   */
  stepWidth: number;
  /**
   * Color of the short steps
   *
   * @default 'lightgray'
   */
  shortStepColor: string;
  /**
   * Color of the long steps
   *
   * @default 'gray'
   */
  longStepColor: string;
  /**
   * Initial value of the ruler picker
   *
   * @default 0
   */
  min: number;
  /**
   * Step of the ruler picker
   *
   * @default 1
   */
  step: number;
  /**
   * Number of decimal places to display
   *
   * @default 1
   */
  fractionDigits?: number;
  /**
   * Number of decimal places to display for long steps specifically
   */
  longStepFractionDigits?: number;
  /**
   * Display mode for the numbers
   * 'decimal' - show decimal numbers (4.1, 4.2, 4.3...)
   * 'integer' - show only integers (4, 5, 6, 7...)
   * 'tens' - show numbers in tens (10, 20, 30...)
   * 'feet' - show height in feet and inches (5' 8")
   *
   * @default 'decimal'
   */
  displayMode?: 'decimal' | 'integer' | 'tens' | 'feet';
  /**
   * First index that is available (corresponds to min value)
   *
   * @default 0
   */
  firstAvailableIndex?: number;
  /**
   * Last index that is available (corresponds to max value)
   */
  lastAvailableIndex?: number;
  /**
   * Total number of available items
   */
  totalItems?: number;
  /**
   * Whether the item is inactive (greyed out, no label)
   *
   * @default false
   */
  isInactive?: boolean;
};

type Props = {
  index: number;
  isLast: boolean;
} & RulerPickerItemProps;

export const RulerPickerItem = React.memo(
  ({
    isLast,
    index,
    isInactive = false,
    firstAvailableIndex = 0,
    lastAvailableIndex,
    gapBetweenSteps,
    shortStepHeight,
    longStepHeight,
    stepWidth,
    shortStepColor,
    longStepColor,
    min,
    step,
    fractionDigits = 1,
    longStepFractionDigits,
    displayMode = 'decimal',
    totalItems,
  }: Props) => {
    const relativeIndex = index - firstAvailableIndex;
    const rawValue = relativeIndex * step + min;
    if (rawValue < 0) return null;

    // Item đầu (min) và cuối (max) available luôn là vạch dài và luôn hiện value.
    // Nếu có ít hơn 15 items available: chỉ item đầu và cuối là long step.
    // Ngược lại: mỗi 10 item (theo relativeIndex), item đầu và cuối available.
    const isFirstAvailable = index === firstAvailableIndex;
    const isLastAvailable = lastAvailableIndex !== undefined && index === lastAvailableIndex;
    const footRemainder = (relativeIndex * step + min) % 12;
    const isFootBoundary =
      displayMode === 'feet' && (Math.abs(footRemainder) < 0.01 || Math.abs(footRemainder - 12) < 0.01);
    const isLong =
      totalItems && totalItems < 15
        ? isFirstAvailable || isLastAvailable
        : displayMode === 'feet'
          ? isFootBoundary || isFirstAvailable || isLastAvailable
          : relativeIndex % 10 === 0 || isFirstAvailable || isLastAvailable;
    const height = isLong ? longStepHeight : shortStepHeight;

    const textWidth = displayMode === 'feet' ? 55 : 30;
    const textLeft = displayMode === 'feet' ? -25 : -15;

    // Tính toán giá trị hiển thị dựa trên displayMode
    let value;
    switch (displayMode) {
      case 'integer':
        value = Math.round(relativeIndex * step + min).toString();
        break;
      case 'tens':
        value = Math.round((relativeIndex * step + min) / 10) * 10;
        break;
      case 'feet': {
        const totalInches = relativeIndex * step + min;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round((totalInches % 12) * 2) / 2;
        const inchStr = inches % 1 === 0 ? `${inches}` : inches.toFixed(1);
        value = `${feet}' ${inchStr}"`;
        break;
      }
      case 'decimal':
      default:
        value = (relativeIndex * step + min).toFixed(longStepFractionDigits ?? fractionDigits);
    }

    return (
      <View
        style={[
          {
            width: stepWidth,
            height: '100%',
            justifyContent: 'center',
            marginRight: isLast ? 0 : gapBetweenSteps,
            marginTop: shortStepHeight,
            opacity: isInactive ? 0.3 : 1,
          },
        ]}
      >
        {isLong && !isInactive && (
          <Text
            style={{
              color: 'white',
              width: textWidth,
              position: 'absolute',
              left: textLeft,
              top: 0,
              textAlign: 'center',
            }}
          >
            {value}
          </Text>
        )}

        <View
          style={[
            {
              width: '100%',
              height: height,
              backgroundColor: isLong ? longStepColor : shortStepColor,
              marginTop: isLong ? 0 : shortStepHeight,
            },
          ]}
        />
      </View>
    );
  }
);
