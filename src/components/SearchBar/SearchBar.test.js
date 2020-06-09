import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

const setup = () => {
  const mockSearch = jest.fn();
  const { getByLabelText, getByRole } = render(
    <SearchBar onSearch={mockSearch} />
  );
  const inputField = getByLabelText('lyrics-search-input');
  const submitButton = getByRole('button');
  return { inputField, submitButton, mockSearch };
};

test('submits term to search function and maintains input field value', () => {
  const { inputField, submitButton, mockSearch } = setup();
  const testValues = ['x', 'xy', '', 'x'];

  // initial value should be empty('')
  expect(inputField.value).toBe('');

  testValues.forEach((val, i) => {
    fireEvent.change(inputField, { target: { value: val } });
    fireEvent.click(submitButton);
    expect(inputField.value).toBe(val);
    expect(mockSearch.mock.calls[i][0]).toBe(val);
  });
});
