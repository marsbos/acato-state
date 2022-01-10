import { setPartialState, setFullState, useSharedState, uiFilterLens, themeLens,cartAmountLens,teamLens, cartLens, cartItemsLens } from './state'

const setTheme = setPartialState(themeLens)
const setFilter = setPartialState(uiFilterLens)
const setCartAmount = setPartialState(cartAmountLens)
// Make some 'api'
const cartActions = setPartialState(cartItemsLens)
const cart = {
	add: (item) => cartActions((items) => [ ...items, item ]),
	remove: (item) => cartActions((items) => items.filter((i) => i !== item))
}

const Buttons = () => {
	return (
		<div>
			<p>
				<button onClick={() => setTheme('Dark')}>Dark mode</button>
				<button onClick={() => setTheme('Light')}>Light mode</button>
				<button onClick={() => setTheme((theme) => `${theme.split('').reverse().join('')}`)}>
					Reverse theme
				</button>
			</p>
			<p>
				<button onClick={() => cart.add(`Item one`)}>Add cart item 1</button>
				<button onClick={() => cart.add(`Item two`)}>Add cart item 2</button>
				<button onClick={() => cart.remove(`Item two`)}>Remove cart item 2</button>
				<button onClick={() => setCartAmount((amount) => amount + 1)}>Set cart amount</button>
			</p>
			<p>
				<button onClick={() => setFullState((state) => ({ ...state, team: 'B-team!' }))}>
					Set full state (no lens/partial): set B-TEAM
				</button>
				<button onClick={() => setFullState((state) => ({ ...state, team: 'C-team!' }))}>
					Set full state (no lens/partial): set C-TEAM
				</button>
			</p>
            <p>
            <button onClick={() => setFilter((filter) => ({ ...filter, field: Math.round(Math.random()*1000)}))}>
					Set filter
				</button>
            </p>
		</div>
	)
}

const SomeComponent = ()=>{
	const {filter} = useSharedState({ filter: uiFilterLens })

    return (
        <>
        <h3>Filter={JSON.stringify(filter)}</h3>
        </>
    )
}

const AnotherChild = () => {
	const { cart } = useSharedState({ cart: cartLens })
	return <div>Cart, amount={cart.amount}</div>
}

const Child = () => {
	const { theme } = useSharedState({ theme: themeLens })
	return (
		<div>
			Child, theme={theme}
			<AnotherChild />
		</div>
	)
}

const ShoppingCart = ({ children }) => {
	const state = useSharedState({ items: cartItemsLens })
	return (
		<div>
			{state && state.items && state.items.map((item, idx) => <p key={idx}>{item}</p>)}
			<Child />
			{children}
		</div>
	)
}
const ShoppingCartChild = () => {
	const { team } = useSharedState({ team: teamLens })
	return <div>Shopcartchild: team={team}</div>
}

function App() {
	const { theme, cart: shopCart } = useSharedState({ theme: themeLens, cart: cartLens })

	return (
		<div className="App">
			<h3>Theme: {theme}</h3>
			<h3>Amount: {shopCart.amount}</h3>
			<Buttons />
			<SomeComponent />
			<ShoppingCart>
				<ShoppingCartChild />
			</ShoppingCart>
		</div>
	)
}

export default App
