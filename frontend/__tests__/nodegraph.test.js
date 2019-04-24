import React from 'react'
import renderer from 'react-test-renderer'
import NodeGraph from '../src/components/nodegraph'

it('renders correctly', () => {
  const tree = renderer
    .create(<NodeGraph></NodeGraph>)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
