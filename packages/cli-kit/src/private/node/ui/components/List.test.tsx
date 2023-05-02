import {List} from './List.js'
import {unstyled} from '../../../../public/node/output.js'
import {render} from '../../testing/ui.js'
import {describe, expect, test} from 'vitest'
import React from 'react'

describe('List', async () => {
  test('renders unordered items', async () => {
    const options = {
      title: 'List title',
      items: ['Item 1', 'Item 2', 'Item 3'],
      ordered: false,
    }

    const {lastFrame} = render(<List {...options} />)

    expect(unstyled(lastFrame()!)).toMatchInlineSnapshot(`
      "List title
        • Item 1
        • Item 2
        • Item 3"
    `)
  })

  test('renders items with margin or not', async () => {
    const options = {
      items: ['Item 1', 'Item 2', 'Item 3'],
      margin: true,
    }

    const {lastFrame: marginLastFrame} = render(<List {...options} />)

    expect(unstyled(marginLastFrame()!)).toMatchInlineSnapshot(`
      "  • Item 1
        • Item 2
        • Item 3"
    `)

    const {lastFrame: noMarginLastFrame} = render(<List {...options} margin={false} />)

    expect(unstyled(noMarginLastFrame()!)).toMatchInlineSnapshot(`
      "• Item 1
      • Item 2
      • Item 3"
    `)
  })

  test('can give the text a color', async () => {
    const options = {
      title: 'List title',
      items: ['Item 1', 'Item 2', 'Item 3'],
      color: 'red',
    }

    const {lastFrame} = render(<List {...options} />)

    expect(lastFrame()).toMatchInlineSnapshot(`
      "[1m[31mList title[39m[22m
        [31m•[39m [31mItem 1[39m
        [31m•[39m [31mItem 2[39m
        [31m•[39m [31mItem 3[39m"
    `)
  })

  test('renders ordered items', async () => {
    const options = {
      items: ['Item 1', 'Item 2', 'Item 3'],
      ordered: true,
    }

    const {lastFrame} = render(<List {...options} />)

    expect(unstyled(lastFrame()!)).toMatchInlineSnapshot(`
      "  1. Item 1
        2. Item 2
        3. Item 3"
    `)
  })
})
