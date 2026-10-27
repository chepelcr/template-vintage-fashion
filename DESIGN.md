# Vintage Fashion — design plan

**Concept: Perchero 70s.** The store is a second-hand clothing rack. Products
hang from wooden hangers on a rail and swing when you point at them or focus
them; categories are the round size dividers that hang on the same rail; prices
are garment tags with a punched hole. One 70s stripe band (rust, mustard,
avocado) closes the hero and opens the footer.

Serves: vintage and second-hand clothing (ropa americana), thrift and
independent boutiques, accessories, alterations.

## Palette

| Token | Hex | Role |
|---|---|---|
| chocolate | `#3B2418` | hero, footer, headings, strong buttons, the rail |
| rust | `#B4532A` | the store's accent (org primary): main buttons, the mark |
| rust text | `#9A4321` | the accent as text (offers, low stock, small labels) |
| mustard | `#D9A23A` | demo notice, cart count, the CTA block, stripes |
| avocado | `#6F7A35` | stripes, category discs |
| oat | `#EFE4D2` | page |
| cream | `#F8F1E4` | tags and sewn labels |
| ink | `#2A1A12` | body text |

Contrast (computed): chocolate on oat 11.5:1 · ink on oat 13.3:1 · soft ink
`#6B5446` on oat 5.6:1 · rust text on oat 5.2:1 · avocado text `#5A6329` on
oat 5.1:1 · white on rust 5.0:1 · ink on mustard 7.3:1 · oat on chocolate
11.5:1 · `#D9C9B1` on chocolate 8.9:1. Category discs take the category's own
colour from the POS and pick ink or white by contrast (`onColor`).

## Type

**Righteous** for display (one weight, rounded 70s geometry) and **Karla**
400–800 for text. Product names on cards use Karla bold so long names stay
readable; Righteous carries page titles, the hero and the disc labels. No
all-caps eyebrows, no monospace labels.

## Layout

```
HOME
┌ chocolate ───────────────────────────────────────────────────────────┐
│ ◁○ badge (tag)                      ═══════╤═════╤═════╤═══════════  │
│ Prendas que ya vivieron              hanger  ┌─────────┐  hanger     │
│ y quieren seguir                             │ CMS     │             │
│ [Ver el perchero] [Visitar la tienda]        │ photo   │ (swings     │
│                                              └─────────┘  once)      │
├ rust / mustard / avocado stripes ────────────────────────────────────┤
 Percheros: size-divider discs on a rail (category colour, name, count)
 Lo último del perchero: a rack — garments on hangers, scroll-snap, arrows
 sewn labels ×3 (CMS highlights) · story with a vertical stripe · mustard CTA
CATALOG: title + count │ search + Filtros (sheet on phones; inline on wide
screens: type, solo ofertas, order) │ category chips │ one rack per category
(grouped) or a grid whose rows share a rail (filtered/sorted)
PRODUCT: the garment hangs from a rail that runs off the page (swings once),
name, tag price, text, sewn label (category, availability, turnaround), add
```

## Signature

The rack (`Hanger`, `Garment`, `Rack`, `CategoryDisc`, `.rail-line`,
`.rack-grid`). The hook sits at 7.5 % of the hanger's width, so rails and the
swing pivot are placed from `--hanger-w`; a grid row draws its rail from each
item's stretch, so rows read as one rail. Swinging is CSS only (`swing`,
`hung`), transform-only, and reduced motion stops it (core.css and
`?motion=reduce`). No WebGL in this template.

Other motion answers an action: the bag swings when something is added, sheets
slide, buttons press. No section fade-ups.

## Changed from the generic default

- Left "cream + high-contrast serif + terracotta": chocolate and oat with a
  rounded 70s display face, rust only as the action colour.
- No product-card grid as the main browse: racks per category, with the grid
  kept for filtered results.
- Categories are size dividers drawn from the category's own colour and name,
  not image tiles; no hard-coded category lists.
- Benefits and values are sewn labels, not icon cards.
