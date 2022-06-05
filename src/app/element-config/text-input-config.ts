import { BaseGeometryConfig } from "./base-geometry-config";

export interface TextInputConfig extends BaseGeometryConfig {
    input?: {
        placeholder?: string;
        placeholderColor?: number;
        fontSize?: string;

        /**
         * The text (value) of the html input element
         */
        text?: string;

        /**
         * The maximum length of the text.
         */
        maxLength?: number;

        /**
         * Set to true to disable the input.
         */
        disabled?: boolean;
    }

    box?: {
        /**
         * The fill color of the box
         */
        fill?: number;

        /**
         * The border-radius
         */
        rounded?: number;
    }
}