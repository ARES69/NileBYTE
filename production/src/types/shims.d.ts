/* Type shims for Sanity Studio configs (studio deploys separately, not part of web build). */
declare module 'sanity' {
  export function defineConfig(config: unknown): unknown
}
declare module 'sanity/structure' {
  export function structureTool(): unknown
}
declare module '@sanity/vision' {
  export function visionTool(): unknown
}
declare module 'sanity/cli' {
  export function defineCliConfig(config: unknown): unknown
}
