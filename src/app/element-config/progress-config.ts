import {BaseGeometryConfig} from "./base-geometry-config";

export interface ProgressConfig extends BaseGeometryConfig {
    /**
     * @default 10
     */
    thickness?: number;

    /**
     * @default 100
     */
    width?: number;

    /**
     * Color of progress line
     * @default 0xe7bc51
     */
    color?: number;
}