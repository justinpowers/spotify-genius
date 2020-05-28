import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

const setup = () => {
  const { getByLabelText } = render(<SearchBar />);
  return getByLabelText('lyrics-search-input');
};

test('update value upon change in input', () => {
  const input = setup();

  fireEvent.change(input, { target: { value: 'x' } });
  expect(input.value).toBe('x');
});
