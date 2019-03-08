import React from 'react';
import renderer from 'react-test-renderer'
import Log from '../src/components/log'

it('renders correctly', ()=>{
    const tree=renderer
        .create(<Log/>)
        .toJSON();
    expect(tree).toMatchSnapshot()
})