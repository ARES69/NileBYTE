import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './cms/schema'

/** Sanity Studio config — deploy studio at /studio (Vercel) or studio.nilebites.com. */
export default defineConfig({
  name: 'nile-bites',
  title: 'Nile Bites CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'nilebites',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes }
})
