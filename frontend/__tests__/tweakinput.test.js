import React from 'react';
import renderer from 'react-test-renderer'
import tweakInput from '../src/components/tweakInput'

it('renders correctly', ()=>{
    const tree=renderer
        .create(<tweakInput></tweakInput>)
        .toJSON();
    expect(tree).toMatchSnapshot()
})