import {BaseGeometryConfig} from "./base-geometry-config";

export interface ButtonConfig extends BaseGeometryConfig {
    /**
     * @default 200
     */
    width?: number;

    /**
     * @default 100
     */
    height?: number;

    /**
     * @default 35
     */
    fontSize?: number;

    /**
     * Text on input
     * @default Button
     */
    label?: string;

    /**
     * @default '#336699'
     */
    stroke?: string;

    /**
     * @default 4
     */
    strokeThickness?: number;
}