import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Search, X, Check } from 'lucide-react-native';

export interface SelectOption {
  id: string;
  name: string;
  state?: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
  error?: string;
  containerClassName?: string;
}

export function Select({
  label,
  placeholder = 'Select option',
  value,
  options,
  onSelect,
  error,
  containerClassName = '',
}: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const selectedItem = options.find((opt) => opt.id === value || opt.name === value);

  const filteredOptions = options.filter((opt) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      opt.name.toLowerCase().includes(q) ||
      (opt.state && opt.state.toLowerCase().includes(q))
    );
  });

  return (
    <View className={`w-full ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium text-[#1E1E1E] mb-2">{label}</Text>
      )}

      <Pressable
        onPress={() => setModalVisible(true)}
        className={`w-full flex-row items-center justify-between bg-white border rounded-2xl px-4 py-3.5 ${
          error ? 'border-red-500' : 'border-[#E5E7EB]'
        }`}
      >
        <Text
          className={`text-base ${
            selectedItem ? 'text-[#1E1E1E] font-medium' : 'text-[#6B7280]'
          }`}
        >
          {selectedItem
            ? `${selectedItem.name}${selectedItem.state ? `, ${selectedItem.state}` : ''}`
            : placeholder}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </Pressable>

      {error && <Text className="text-xs text-red-500 mt-1.5 ml-1">{error}</Text>}

      {/* Selector Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View className="px-5 py-4 border-b border-[#F1F5F9] flex-row items-center justify-between">
            <Text className="text-lg font-bold text-[#1E1E1E]">
              {placeholder}
            </Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              className="p-1 rounded-full bg-[#F1F5F9]"
            >
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          {/* Search bar */}
          <View className="px-5 py-3">
            <View className="flex-row items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5">
              <Search size={18} color="#94A3B8" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search..."
                placeholderTextColor="#94A3B8"
                className="flex-1 ml-2 text-base text-[#1E1E1E] py-0"
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')}>
                  <X size={16} color="#94A3B8" />
                </Pressable>
              )}
            </View>
          </View>

          {/* List */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            renderItem={({ item }) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                  className={`flex-row items-center justify-between py-3.5 border-b border-[#F1F5F9] ${
                    isSelected ? 'bg-[#FFF8F6] px-3 rounded-xl' : ''
                  }`}
                >
                  <View>
                    <Text
                      className={`text-base ${
                        isSelected ? 'font-bold text-[#EE4D38]' : 'font-medium text-[#1E1E1E]'
                      }`}
                    >
                      {item.name}
                    </Text>
                    {item.state && (
                      <Text className="text-xs text-[#64748B] mt-0.5">{item.state}</Text>
                    )}
                  </View>
                  {isSelected && <Check size={20} color="#EE4D38" />}
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}
