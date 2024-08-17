import React, { useState, useEffect } from 'react'
import { View, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const Edit = () => {
  const [items, setItems] = useState([''])

  useEffect(() => {
    const storedItems = Taro.getStorageSync('wheelItems')
    if (storedItems) {
      setItems(storedItems)
    }
  }, [])

  const handleItemChange = (index, value) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, ''])
  }

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const saveItems = () => {
    const filteredItems = items.filter(item => item.trim() !== '')
    Taro.setStorageSync('wheelItems', filteredItems)
    Taro.navigateBack()
  }

  return (
    <View className='edit'>
      {items.map((item, index) => (
        <View key={index} className='item-input'>
          <Input
            value={item}
            onInput={(e) => handleItemChange(index, e.detail.value)}
            placeholder={`Item ${index + 1}`}
          />
          <Button onClick={() => removeItem(index)}>Remove</Button>
        </View>
      ))}
      <Button onClick={addItem}>Add Item</Button>
      <Button onClick={saveItems}>Save</Button>
    </View>
  )
}

export default Edit