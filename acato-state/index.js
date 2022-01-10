import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { BehaviorSubject, distinctUntilChanged, filter, Observable, Subject, switchMap } from 'rxjs'

const lensView = (lenses) => (source) => {
	const lensEntries = Object.entries(lenses)
	return new Observable((subscriber) => {
		return source.subscribe({
			next(value) {
				const result = lensEntries.reduce((memo, [ key, lens ]) => {
					memo[key] = R.view(lens, value)
					return memo
				}, {})
				subscriber.next(result)
			}
		})
	})
}

export const createSharedState = (initialValue) => {
	const store$ = new BehaviorSubject(initialValue)
	// outside react:
	const setNextState = (value, lens) => store$.next(R.set(lens, value, store$.getValue()))
	const setPartialState = (lens) => (nextState) => {
		if (typeof nextState === 'function') {
			setNextState(nextState(R.view(lens, store$.getValue())), lens)
		} else {
			setNextState(nextState, lens)
		}
	}
	const setFullState = (nextState) => {
		setPartialState(R.lensPath([]))(nextState)
	}
	// the hook:
	const useSharedState = (lenses) => {
		const [ state, setState ] = useState(store$.getValue())
		useEffect(() => {
			const subscription = store$.pipe(lensView(lenses), distinctUntilChanged()).subscribe((value) => {
				setState(value)
			})
			return () => subscription.unsubscribe()
		}, [])
		return state
	}
	return [ setFullState, setPartialState, useSharedState ]
}
