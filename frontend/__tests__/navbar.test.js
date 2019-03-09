import React from 'react'
import renderer from 'react-test-renderer'
import Navbar from '../src/components/navbar'

it('renders correctly', () => {
  const tree = renderer
    .create(<Navbar></Navbar>)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
