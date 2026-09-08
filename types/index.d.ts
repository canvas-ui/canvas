export type WallpaperScheme = 'light' | 'dark'

export interface WallpaperSource {
    /** MIME type of this rendition, e.g. `image/avif`. */
    type: string
    /** Path relative to the copied package root, e.g. `files/canvas.avif`. */
    src: string
}

export interface Wallpaper {
    id: string
    title: string
    /** Which UI scheme the wallpaper is meant to sit under. */
    scheme: WallpaperScheme
    /** Dominant colour — usable as an instant placeholder behind the image. */
    background: string
    /** Foreground colour of the artwork; a sensible accent to pair with it. */
    accent: string
    /** Renditions, best-first. The last entry is always widely supported. */
    sources: WallpaperSource[]
    /** Path to the picker thumbnail, relative to the copied package root. */
    thumb: string
    author: string
    /** Where the artwork came from, for third-party work. */
    source?: string
    /** SPDX id, or a `LicenseRef-` key documented in NOTICE. */
    license: string
}

export declare const wallpapers: Wallpaper[]
export declare const BASE_PATH: string
export declare function getWallpaper(id: string): Wallpaper | undefined
export declare function wallpaperUrl(
    wallpaper: Wallpaper | string,
    options?: { base?: string; types?: string[] },
): string | null
export declare function wallpaperThumbUrl(
    wallpaper: Wallpaper | string,
    base?: string,
): string | null
