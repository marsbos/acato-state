import { lensPath, lensProp } from 'ramda'
import { createSharedState } from '../acato-state'

export const [ setFullState, setPartialState, useSharedState ] = createSharedState({
	team: 'A-Team',
	cart: { items: [ 'item 3' ], amount: 0 },
	ui: { filter: { field: 'team' }, theme: '' }
})

export const themeLens = lensPath([ 'ui', 'theme' ])
export const uiFilterLens = lensPath([ 'ui', 'filter' ])
export const teamLens = lensProp('team')
export const cartItemsLens = lensPath([ 'cart', 'items' ])
export const cartAmountLens = lensPath([ 'cart', 'amount' ])
export const cartLens = lensPath([ 'cart' ])
