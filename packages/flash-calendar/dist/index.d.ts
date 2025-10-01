import * as react from 'react';
import { ReactNode } from 'react';
import { ViewStyle, TextStyle, TextProps, ColorSchemeName } from 'react-native';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { FlashListProps, FlashList } from '@shopify/flash-list';
import * as mitt from 'mitt';

/** All fields that affects the day's state. */
interface CalendarDayStateFields {
    /** Is this day disabled? */
    isDisabled: boolean;
    /** Is this the current day? */
    isToday: boolean;
    /** Is this the start of a range? */
    isStartOfRange: boolean;
    /**  Is this the end of a range? */
    isEndOfRange: boolean;
    /** The state of the day */
    state: DayState;
    /** Is the range valid (has both start and end dates set)? */
    isRangeValid: boolean;
}
/**
 * The type of each day in the calendar. Has a few pre-computed properties to
 * help increase re-rendering performance.
 */
type CalendarDayMetadata = {
    date: Date;
    /** The day displayed in the desired format from `calendarDayFormat` */
    displayLabel: string;
    /** Does this day belong to a different month? */
    isDifferentMonth: boolean;
    /** Is this the last day of the month? */
    isEndOfMonth: boolean;
    /** Is this the last day of the week? */
    isEndOfWeek: boolean;
    /** Is this the first day of the month? */
    isStartOfMonth: boolean;
    /** Is this the first day of the week? */
    isStartOfWeek: boolean;
    /** Is this day part of the weekend? */
    isWeekend: boolean;
    /** The ID of this date is the `YYYY-MM-DD` representation */
    id: string;
} & CalendarDayStateFields;
/**
 * An active date range to highlight in the calendar.
 */
interface CalendarActiveDateRange {
    startId?: string;
    endId?: string;
}
interface UseCalendarParams {
    /**
     * The calendar's month. It can be any date within the month, since it gets
     * normalized to the first day of the month.
     *
     * **Tip**: To convert to date ID, use `toDateId(date)`.
     */
    calendarMonthId: string;
    /**
     * The minimum date allowed to be selected (inclusive). Dates earlier than
     * this will be disabled.
     *
     * **Tip**: To convert to date ID, use `toDateId(date)`.
     */
    calendarMinDateId?: string;
    /**
     * The maximum date allowed to be selected (inclusive). Dates later than this
     * will be disabled.
     *
     * **Tip**: To convert to date ID, use `toDateId(date)`.
     */
    calendarMaxDateId?: string;
    /**
     * The locale to use for the date formatting. If you're using custom
     * formatting functions, this value will be forwarded as the second argument.
     * @defaultValue "en-US"
     */
    calendarFormatLocale?: string;
    /**
     * A custom function to override the default month format ("January 2022").
     */
    getCalendarMonthFormat?: (date: Date, locale: string) => string;
    /**
     * A custom function to override the default month format ("S", "M", "T").
     */
    getCalendarWeekDayFormat?: (date: Date, locale: string) => string;
    /**
     * A custom function to override the default day format ("1", "9", "17").
     */
    getCalendarDayFormat?: (date: Date, locale: string) => string;
    /**
     * The day of the week to start the calendar with.
     * @defaultValue "sunday"
     */
    calendarFirstDayOfWeek?: "sunday" | "monday";
    /**
     * The active date ranges to highlight in the calendar.
     */
    calendarActiveDateRanges?: CalendarActiveDateRange[];
    /**
     * The disabled date IDs. Dates in this list will be in the `disabled` state
     * unless they are part of an active range.
     */
    calendarDisabledDateIds?: string[];
}
/**
 * Builds a calendar based on the given parameters.
 */
declare const buildCalendar: (params: UseCalendarParams) => {
    weeksList: CalendarDayMetadata[][];
    calendarRowMonth: string;
    weekDaysList: string[];
};
/**
 * Returns a memoized calendar based on the given parameters.
 */
declare const useCalendar: (params: UseCalendarParams) => {
    weeksList: CalendarDayMetadata[][];
    calendarRowMonth: string;
    weekDaysList: string[];
};

declare module "react-native" {
    interface PressableStateCallbackType {
        hovered?: boolean;
        focused?: boolean;
    }
}
type DayState = "idle" | "active" | "today" | "disabled";
interface DayTheme {
    container: Omit<ViewStyle, "borderRadius">;
    content: TextStyle;
}
interface CalendarItemDayProps {
    children: ReactNode;
    onPress: (id: string) => void;
    metadata: CalendarDayMetadata;
    theme?: Partial<Record<DayState | "base", (params: CalendarDayMetadata & {
        isPressed: boolean;
        isHovered?: boolean;
        isFocused?: boolean;
    }) => Partial<DayTheme>>>;
    /** The cell's height */
    height: number;
    /** Optional TextProps to spread to the <Text> component. */
    textProps?: Omit<TextProps, "children" | "onPress">;
}
/**
 * The base calendar item day component. This component is responsible for
 * rendering each day cell, along with its event handlers.
 *
 * This is not meant to be used directly. Instead, use the
 * `CalendarItemDayWithContainer`, since it also includes the spacing between
 * each day.
 */
declare const CalendarItemDay: ({ onPress, children, theme, height, metadata, textProps, }: CalendarItemDayProps) => react_jsx_runtime.JSX.Element;
interface CalendarItemDayContainerTheme {
    /** An empty view that acts as a spacer between each day. The spacing is
     * controlled by the `daySpacing` prop. */
    spacer?: ViewStyle;
    /** An absolute positioned filler to join the active days together in a single
     * complete range. */
    activeDayFiller?: ViewStyle;
}
interface CalendarItemDayContainerProps {
    children: ReactNode;
    isStartOfWeek: boolean;
    /**
     * If true, the active day filler/extension will be shown. The filler is used
     * as a visual effect to join the active days together in a complete range.
     */
    shouldShowActiveDayFiller?: boolean;
    theme?: CalendarItemDayContainerTheme;
    /**
     * The spacing between each day
     */
    daySpacing: number;
    /** The day's height */
    dayHeight: number;
}
declare const CalendarItemDayContainer: ({ children, isStartOfWeek, shouldShowActiveDayFiller, theme, daySpacing, dayHeight, }: CalendarItemDayContainerProps) => react_jsx_runtime.JSX.Element;
interface CalendarItemDayWithContainerProps extends Omit<CalendarItemDayProps, "height">, Pick<CalendarItemDayContainerProps, "daySpacing" | "dayHeight"> {
    containerTheme?: CalendarItemDayContainerTheme;
    /**
     * A unique identifier for this calendar instance. This is useful if you
     * need to render more than one calendar at once. This allows Flash Calendar
     * to scope its state to the given instance.
     *
     * No need to get fancy with `uuid` or anything like that - a simple static
     * string is enough.
     *
     * If not provided, Flash Calendar will use a default value which will hoist
     * the state in a global scope.
     */
    calendarInstanceId?: string;
}
declare const CalendarItemDayWithContainer: ({ children, metadata: baseMetadata, onPress, theme, dayHeight, daySpacing, containerTheme, calendarInstanceId, }: CalendarItemDayWithContainerProps) => react_jsx_runtime.JSX.Element;

interface CalendarItemEmptyProps {
    /** The height of the cell. Should be the same as `CalendarItemDay`. */
    height: number;
    /** The theme of the empty cell, useful for customizing the component. */
    theme?: {
        container?: ViewStyle;
    };
}
declare const CalendarItemEmpty: react.NamedExoticComponent<CalendarItemEmptyProps>;

interface CalendarItemWeekNameTheme {
    container?: ViewStyle;
    content?: TextStyle;
}
interface CalendarItemWeekNameProps {
    children: ReactNode;
    /**
     * The height of the week name, needed to correctly measure the calendar's
     */
    height: number;
    /** The theme of the week name, useful for customizing the component. */
    theme?: CalendarItemWeekNameTheme;
    /** Optional TextProps to spread to the <Text> component. */
    textProps?: Omit<TextProps, "children">;
}
declare const CalendarItemWeekName: ({ children, height, theme, textProps, }: CalendarItemWeekNameProps) => react_jsx_runtime.JSX.Element;

interface CalendarRowMonthTheme {
    container?: ViewStyle;
    content?: TextStyle;
}
interface CalendarRowMonthProps {
    children: ReactNode;
    /**
     * The height of the month row, needed to correctly measure the calendar's
     * height.
     */
    height: number;
    /** The theme of the month row, useful for customizing the component. */
    theme?: CalendarRowMonthTheme;
}
declare const CalendarRowMonth: ({ children, height, theme, }: CalendarRowMonthProps) => react_jsx_runtime.JSX.Element;

/**
 * Minimal theme for the Flash Calendar component.
 * @internal
 */
declare const lightTheme: {
    readonly colors: {
        readonly content: {
            readonly disabled: "#B0B0B0";
            readonly primary: "#000000";
            readonly secondary: "#212121";
            readonly inverse: {
                readonly primary: "#FFFFFF";
            };
        };
        readonly background: {
            readonly primary: "#FFFFFF";
            readonly tertiary: "#EDEFEE";
            readonly tertiaryPressed: "#D1D2D3";
            readonly inverse: {
                readonly primary: "#000000";
            };
        };
        readonly borders: {
            readonly default: "#E0E0E0";
        };
        readonly transparent: "transparent";
    };
    readonly spacing: {
        readonly 0: 0;
        readonly 2: 2;
        readonly 4: 4;
        readonly 6: 6;
        readonly 8: 8;
        readonly 12: 12;
        readonly 16: 16;
        readonly 20: 20;
        readonly 24: 24;
    };
};
declare const darkTheme: {
    readonly colors: {
        readonly content: {
            readonly disabled: "#bdbdbd";
            readonly primary: "#FFFFFF";
            readonly secondary: "#e8e8e8";
            readonly inverse: {
                readonly primary: "#000000";
            };
        };
        readonly background: {
            readonly primary: "#000000";
            readonly tertiary: "#111111";
            readonly tertiaryPressed: "#212121";
            readonly inverse: {
                readonly primary: "#FFFFFF";
            };
        };
        readonly borders: {
            readonly default: "#5c5c5c";
        };
        readonly transparent: "transparent";
    };
    readonly spacing: {
        readonly 0: 0;
        readonly 2: 2;
        readonly 4: 4;
        readonly 6: 6;
        readonly 8: 8;
        readonly 12: 12;
        readonly 16: 16;
        readonly 20: 20;
        readonly 24: 24;
    };
};
type BaseTheme = typeof lightTheme | typeof darkTheme;

interface CalendarRowWeekProps {
    children: ReactNode;
    spacing?: keyof BaseTheme["spacing"];
    theme?: CalendarRowWeekTheme;
}
interface CalendarRowWeekTheme {
    container?: ViewStyle;
}
declare const CalendarRowWeek: ({ children, spacing, theme, }: CalendarRowWeekProps) => react_jsx_runtime.JSX.Element;

interface CalendarTheme {
    rowMonth?: CalendarRowMonthProps["theme"];
    rowWeek?: CalendarRowWeekProps["theme"];
    itemWeekName?: CalendarItemWeekNameProps["theme"];
    itemEmpty?: CalendarItemEmptyProps["theme"];
    itemDayContainer?: CalendarItemDayContainerProps["theme"];
    /**
     * The theme for the day. `base` is applied before any state, allowing you to
     * set a base value once and use it for all states.
     */
    itemDay?: CalendarItemDayProps["theme"];
}
type CalendarOnDayPress = (dateId: string) => void;
interface CalendarProps extends UseCalendarParams {
    /**
     * A unique identifier for this calendar instance. This is useful if you
     * need to render more than one calendar at once. This allows Flash Calendar
     * to scope its state to the given instance.
     *
     * No need to get fancy with `uuid` or anything like that - a simple static
     * string is enough.
     *
     * If not provided, Flash Calendar will use a default value which will hoist
     * the state in a global scope.
     */
    calendarInstanceId?: string;
    /**
     * The spacing between each calendar row (the month header, the week days row,
     * and the weeks row)
     * @defaultValue 8
     */
    calendarRowVerticalSpacing?: number;
    /**
     * The spacing between each day in the weeks row.
     * @defaultValue 8
     */
    calendarRowHorizontalSpacing?: number;
    /**
     * The height of each day cell.
     * @defaultValue 32
     */
    calendarDayHeight?: number;
    /**
     * The height of the week day's header.
     * @defaultValue calendarDayHeight
     */
    calendarWeekHeaderHeight?: number;
    /**
     * The height of the month header.
     * @defaultValue 20
     */
    calendarMonthHeaderHeight?: number;
    /**
     * When set, Flash Calendar will use this color scheme instead of the system's
     * value (`light|dark`). This is useful if your app doesn't support dark-mode,
     * for example.
     *
     * We don't advise using this prop - ideally, your app should reflect the
     * user's preferences.
     * @defaultValue undefined
     */
    calendarColorScheme?: ColorSchemeName;
    /**
     * The callback to be called when a day is pressed.
     */
    onCalendarDayPress: CalendarOnDayPress;
    /** Theme to customize the calendar component. */
    theme?: CalendarTheme;
}
declare const Calendar$1: react.NamedExoticComponent<CalendarProps>;

interface CalendarMonth {
    id: string;
    date: Date;
    numberOfWeeks: number;
}
interface UseCalendarListParams extends Pick<UseCalendarParams, "calendarMinDateId" | "calendarMaxDateId"> {
    /**
     * The initial month to open the calendar to, as a `YYYY-MM-DD` string.
     * @defaultValue today
     */
    calendarInitialMonthId?: string;
    /**
     * How many months to show before the current month. Only applicable if
     * `calendarMinDateId` is not set.
     */
    calendarPastScrollRangeInMonths: number;
    /**
     * How many months to show after the current month. Applicable if
     * `calendarMaxDateId` is not set.
     */
    calendarFutureScrollRangeInMonths: number;
    calendarFirstDayOfWeek: "monday" | "sunday";
}
/**
 * Returns a list of months to display in the calendar, and methods to append
 * and prepend months to the list.
 */
declare const useCalendarList: ({ calendarInitialMonthId, calendarPastScrollRangeInMonths, calendarFutureScrollRangeInMonths, calendarFirstDayOfWeek, calendarMaxDateId, calendarMinDateId, }: UseCalendarListParams) => {
    /**
     * The list of months to display in the calendar.
     */
    monthList: CalendarMonth[];
    /**
     * The index of the initial month in the list.
     */
    initialMonthIndex: number;
    /**
     * Appends new months to the list.
     */
    appendMonths: (numberOfMonths: number) => void;
    /**
     * Prepends new months to the list.
     */
    prependMonths: (numberOfMonths: number) => void;
    /**
     * Adds missing months to the list, so that the target month is included.
     */
    addMissingMonths: (targetMonthId: string) => CalendarMonth[];
};
/**
 * Returns the absolute height for a month, accounting for the spacings and
 * headers.
 */
declare const getHeightForMonth: ({ calendarRowVerticalSpacing: vSpacing, calendarDayHeight: day, calendarWeekHeaderHeight: weekName, calendarMonthHeaderHeight: header, calendarAdditionalHeight: extraHeight, calendarMonth, calendarSpacing, }: {
    calendarAdditionalHeight: number;
    calendarDayHeight: number;
    calendarMonthHeaderHeight: number;
    calendarRowVerticalSpacing: number;
    calendarWeekHeaderHeight: number;
    calendarMonth: CalendarMonth;
    calendarSpacing: number;
}) => number;

/**
 * Represents each `CalendarList` item. It's enhanced with the required
 * `Calendar` props to simplify building custom `Calendar` components.
 */
type CalendarMonthEnhanced = CalendarMonth & {
    calendarProps: Omit<CalendarProps, "calendarMonthId">;
};
interface CalendarListProps extends Omit<CalendarProps, "calendarMonthId">, Omit<FlashListProps<CalendarMonthEnhanced>, "renderItem" | "data"> {
    /**
     * How many months to show before the current month. Once the user scrolls
     * past this range and if they haven't exceeded the `calendarMinDateId`, new
     * months are prepended in this increment.
     * @defaultValue 12
     */
    calendarPastScrollRangeInMonths?: number;
    /**
     * How many months to show after the current month. Once the user scrolls
     * past this range and if they haven't exceeded the `calendarMaxDateId`, new
     * months are appended in this increment.
     * @defaultValue 12
     */
    calendarFutureScrollRangeInMonths?: number;
    /**
     * An additional height to use in the month's height calculation. Useful when
     * providing a custom `Calendar` component with extra content such as a
     * footer.
     */
    calendarAdditionalHeight?: number;
    /**
     * The vertical spacing between each `<Calendar />` component.
     * @defaultValue 20
     */
    calendarSpacing?: number;
    /**
     * The initial month to open the calendar to, as a `YYYY-MM-DD` string.
     * Defaults to the current month.
     *
     * **Tip**: To convert to date ID, use `toDateId(date)`.
     */
    calendarInitialMonthId?: string;
    /**
     * The scroll component to use. Useful if you need to replace the FlashList
     * with an alternative (e.g. a BottomSheet FlashList).
     * @defaultValue FlashList
     */
    CalendarScrollComponent?: typeof FlashList;
    /**
     * Overwrites the default `Calendar` component.
     *
     * **Important**: when providing a custom implementation, make sure to
     * manually set all the spacing and height props to ensure the list scrolls
     * to the right offset:
     * - calendarDayHeight
     * - calendarMonthHeaderHeight
     * - calendarWeekHeaderHeight
     * - calendarAdditionalHeight
     * - calendarRowVerticalSpacing
     * - calendarSpacing
     */
    renderItem?: FlashListProps<CalendarMonthEnhanced>["renderItem"];
}
interface ImperativeScrollParams {
    /**
     * An additional offset to add to the final scroll position. Useful when
     * you need to slightly change the final scroll position.
     */
    additionalOffset?: number;
}
interface CalendarListRef {
    scrollToMonth: (date: Date, animated: boolean, params?: ImperativeScrollParams) => void;
    scrollToDate: (date: Date, animated: boolean, params?: ImperativeScrollParams) => void;
    scrollToOffset: (offset: number, animated: boolean) => void;
}
declare const CalendarList: react.NamedExoticComponent<CalendarListProps & react.RefAttributes<CalendarListRef>>;

interface HStackProps {
    alignItems?: ViewStyle["alignItems"];
    justifyContent?: ViewStyle["justifyContent"];
    children: ReactNode;
    grow?: boolean;
    shrink?: boolean;
    spacing?: number;
    wrap?: ViewStyle["flexWrap"];
    backgroundColor?: string;
    style?: ViewStyle;
    width?: ViewStyle["width"];
}
declare const HStack: ({ alignItems, children, justifyContent, grow, shrink, spacing, wrap, backgroundColor, width, style, }: HStackProps) => react_jsx_runtime.JSX.Element;

interface VStackProps {
    children: ReactNode;
    spacing?: number;
    alignItems?: ViewStyle["alignItems"];
    justifyContent?: ViewStyle["justifyContent"];
    /** If the VStack should `flex: 1` to fill the parent's height */
    grow?: boolean;
}
declare function VStack({ children, spacing, alignItems, justifyContent, grow, }: VStackProps): react_jsx_runtime.JSX.Element;

/**
 * This file houses the public API for the flash-calendar package.
 */
type CalendarItemDayNamespace = {
    Container: typeof CalendarItemDayContainer;
    WithContainer: typeof CalendarItemDayWithContainer;
} & typeof CalendarItemDay;
declare const CalendarItemDayWithNamespace: CalendarItemDayNamespace;

interface CalendarItemNamespace {
    /**
     * Renders the day item of the calendar (e.g. `1`, `2`, `3`, etc.)
     */
    Day: typeof CalendarItemDayWithNamespace;
    /**
     * Renders the week day name item of the calendar (e.g. `Sun`, `Mon`, `Tue`, etc.)
     */
    WeekName: typeof CalendarItemWeekName;
    /**
     * Renders an empty item to fill the calendar's grid in the start or end of
     * the month.
     */
    Empty: typeof CalendarItemEmpty;
}
declare const CalendarItemWithNamespace: CalendarItemNamespace;

interface CalendarRowNamespace {
    /**
     * Renders the month row of the calendar (e.g. `January`, `February`, `March`, etc.)
     */
    Month: typeof CalendarRowMonth;
    /**
     * Renders each week row of the calendar, including the week day names.
     */
    Week: typeof CalendarRowWeek;
}
declare const CalendarRowWithNamespace: CalendarRowNamespace;

type CalendarNamespace = {
    Item: typeof CalendarItemWithNamespace;
    Row: typeof CalendarRowWithNamespace;
    List: typeof CalendarList;
    HStack: typeof HStack;
    VStack: typeof VStack;
} & typeof Calendar$1;

declare const Calendar: CalendarNamespace;

/**
 * Returns the date formatted as YYYY-MM-DD, ensuring timezone doesn't affect
 * the result.
 */
declare function toDateId(date: Date): string;
/**
 * Converts a date ID to a `Date` object, correctly accounting for timezone.
 */
declare function fromDateId(dateId: string): Date;

interface OnSetActiveDateRangesPayload {
    instanceId?: string;
    ranges: CalendarActiveDateRange[];
}
/**
 * An event emitter for the active date ranges. This notifies the calendar items
 * when their state changes, allowing just the affected items to re-render.
 *
 * While this is an implementation detail focused on improving performance, it's
 * exported in case you need to build your own calendar. Check the source code
 * for a reference implementation.
 */
declare const activeDateRangesEmitter: mitt.Emitter<{
    onSetActiveDateRanges: OnSetActiveDateRangesPayload;
}>;
/**
 * Returns an optimized metadata for a particular day. This hook listens to the
 * `activeDateRanges` emitter, enabling only the affected calendar items to
 * re-render.
 *
 * While this is an implementation detail focused on improving performance, it's
 * exported in case you need to build your own calendar. Check the source code
 * for a reference implementation.
 */
declare const useOptimizedDayMetadata: (baseMetadata: CalendarDayMetadata, calendarInstanceId?: string) => CalendarDayMetadata;

/**
 * A convenience hook to simplify managing a date range in the calendar in a
 * performant way.
 */
declare const useDateRange: (initialDateRange?: CalendarActiveDateRange) => {
    /**
     * The current date range.
     **/
    dateRange: CalendarActiveDateRange;
    /**
     * Derived from the current date range as a convenience when passing to
     * the `<Calendar.List />` component.
     */
    calendarActiveDateRanges: CalendarActiveDateRange[];
    /**
     * Clears the current date range.
     */
    onClearDateRange: () => void;
    /**
     * Callback to pass to the `<Calendar.List />` component to handle date
     * range.
     */
    onCalendarDayPress: CalendarOnDayPress;
    /**
     * Whether the current date range is valid (e.g. has both start and end
     * dates)
     */
    isDateRangeValid: boolean;
};

export { Calendar, type CalendarActiveDateRange, type CalendarDayMetadata, type CalendarItemDayContainerProps, type CalendarItemDayProps, type CalendarItemDayWithContainerProps, type CalendarItemEmptyProps, type CalendarItemWeekNameProps, type CalendarListProps, type CalendarListRef, type CalendarMonth, type CalendarMonthEnhanced, type CalendarOnDayPress, type CalendarProps, type CalendarRowMonthProps, type CalendarRowWeekProps, type CalendarTheme, type HStackProps, type UseCalendarListParams, type UseCalendarParams, type VStackProps, activeDateRangesEmitter, buildCalendar, fromDateId, getHeightForMonth, toDateId, useCalendar, useCalendarList, useDateRange, useOptimizedDayMetadata };
