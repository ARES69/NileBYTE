/**
 * Nile Bites — Sanity CMS schema (v3).
 * Content types editors touch: products, stores, sauces, social clips, FAQ, SEO.
 * Orders/scans/loyalty live in Postgres (prisma/schema.prisma), NOT in CMS.
 */
import { defineField, defineType } from '@sanity/types'

const localeString = (name: string, title: string) =>
  defineField({
    name, title, type: 'object',
    fields: [
      { name: 'en', type: 'string', title: 'English' },
      { name: 'ar', type: 'string', title: 'Arabic (Egyptian register)' },
      { name: 'ru', type: 'string', title: 'Russian (tourist layer)' }
    ]
  })

export const schemaTypes = [
  defineType({
    name: 'product',
    title: 'Product (bite)',
    type: 'document',
    fields: [
      defineField({ name: 'slug', type: 'slug', options: { source: 'name.en' } }),
      localeString('name', 'Name'),
      localeString('description', 'Description'),
      defineField({ name: 'priceEgp', type: 'number', title: 'Base price EGP (12 bites)' }),
      defineField({ name: 'allergens', type: 'array', of: [{ type: 'string', options: { list: ['GL', 'DA', 'EG', 'SH', 'SE'] } }] }),
      defineField({ name: 'tags', type: 'array', of: [{ type: 'string', options: { list: ['veg', 'spicy', 'sea'] } }] }),
      defineField({ name: 'kcal', type: 'number' }),
      defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
      defineField({ name: 'onSale', type: 'boolean', initialValue: true })
    ]
  }),
  defineType({
    name: 'store',
    title: 'Store',
    type: 'document',
    fields: [
      defineField({ name: 'slug', type: 'slug', options: { source: 'city.en' } }),
      localeString('city', 'City'),
      localeString('address', 'Address'),
      defineField({ name: 'geo', type: 'geopoint' }),
      defineField({ name: 'phone', type: 'string' }),
      defineField({ name: 'live', type: 'boolean', initialValue: false }),
      defineField({ name: 'hours', type: 'object', fields: [
        { name: 'sunThu', type: 'string', title: 'Sun–Thu', initialValue: '10:00 — 02:00' },
        { name: 'friSat', type: 'string', title: 'Fri–Sat', initialValue: '10:00 — 03:00' }
      ] }),
      defineField({ name: 'deliveryZones', type: 'array', of: [{ type: 'string' }] }),
      defineField({ name: 'partnerLinks', type: 'object', fields: [
        { name: 'talabat', type: 'url' }, { name: 'elmenus', type: 'url' }
      ] })
    ]
  }),
  defineType({
    name: 'sauce',
    title: 'Sauce',
    type: 'document',
    fields: [
      localeString('name', 'Name'),
      localeString('tastingNotes', 'Tasting notes (3 words)'),
      defineField({ name: 'colorHex', type: 'color' }),
      defineField({ name: 'secret', type: 'boolean', title: 'Secret recipe (Signature)', initialValue: false })
    ]
  }),
  defineType({
    name: 'socialClip',
    title: 'Social clip (feed 9:16)',
    type: 'document',
    fields: [
      defineField({ name: 'video', type: 'file', options: { accept: 'video/mp4' } }),
      defineField({ name: 'poster', type: 'image' }),
      localeString('caption', 'Caption'),
      defineField({ name: 'durationSec', type: 'number' }),
      defineField({ name: 'source', type: 'string', title: 'brand | ugc', initialValue: 'brand' }),
      defineField({ name: 'rightsGranted', type: 'boolean', title: 'UGC rights granted', initialValue: false })
    ]
  }),
  defineType({
    name: 'faq',
    title: 'FAQ item',
    type: 'document',
    fields: [
      defineField({ name: 'topic', type: 'string', options: { list: ['franchise', 'product', 'delivery', 'club'] } }),
      localeString('question', 'Question'),
      localeString('answer', 'Answer')
    ]
  }),
  defineType({
    name: 'pageSeo',
    title: 'Page SEO',
    type: 'document',
    fields: [
      defineField({ name: 'path', type: 'string', title: 'Route path', description: 'e.g. /franchise' }),
      localeString('title', 'Title'),
      localeString('metaDescription', 'Meta description'),
      defineField({ name: 'ogImage', type: 'image' })
    ]
  })
]
