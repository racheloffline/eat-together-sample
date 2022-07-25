import React, { Component } from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  Keyboard,
  StyleSheet
} from 'react-native';
import { TextInput } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';

import NormalText from "./NormalText";
import SmallText from './SmallText';

export default class TagsSection extends Component {
  constructor(props) {
    super(props);
    this.renderTextInput = this.renderTextInput.bind(this);
    this.renderFlatList = this.renderFlatList.bind(this);
    this.searchedItems = this.searchedItems.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.state = {
      item: "",
      listItems: [],
      focus: false
    };
  }

  renderFlatList = () => {
    if (this.state.focus) {
      const flatListPorps = { ...this.props.listProps };
      const oldSupport = [
        { key: 'keyboardShouldPersistTaps', val: 'always' }, 
        { key: 'nestedScrollEnabled', val : false },
        { key: 'style', val : { ...this.props.itemsContainerStyle } },
        { key: 'data', val : this.state.listItems },
        { key: 'keyExtractor', val : (item, index) => index.toString() },
        { key: 'renderItem', val : ({ item, index }) => this.renderItems(item, index) },
      ];
      oldSupport.forEach((kv) => {
        if(!Object.keys(flatListPorps).includes(kv.key)) {
          flatListPorps[kv.key] = kv.val;
        } else {
          if(kv.key === 'style') {
            flatListPorps['style'] = kv.val;
          }
        }
      });
      return (
        <FlatList
          { ...flatListPorps }
        />
      );
    }
  };

  componentDidMount = () => {
    const listItems = this.props.items;
    const defaultIndex = this.props.defaultIndex;
    if (defaultIndex && listItems.length > defaultIndex) {
      this.setState({
        listItems,
        item: listItems[defaultIndex]
      });
    } else {
      this.setState({ listItems });
    }
  };

  searchedItems = searchedText => {
    let setSort = this.props.setSort;
    if (!setSort && typeof setSort !== 'function') {
        setSort = (item, searchedText) => { 
          return item.toLowerCase().indexOf(searchedText.toLowerCase()) > -1
        };
    }

    var ac = this.props.items.filter((item) => {
      return setSort(item, searchedText);
    });

    this.setState({ listItems: ac, item: searchedText });
  };

  renderItems = (item, index) => {
    if (this.state.item !== "") {
        if (this.props.multi && this.props.selectedItems && this.props.selectedItems.length > 0) {
            return (
                this.props.selectedItems.find(sitem => sitem === item) ?

                <TouchableOpacity style={{...styles.item, backgroundColor: "#5DB075", borderBottomWidth: 0}}>
                    <NormalText>{ item }</NormalText>
                </TouchableOpacity>

                : <TouchableOpacity
                    onPress={() => {
                        Keyboard.dismiss();
                        this.setState({
                            item: "",
                            listItems: this.props.items
                        });

                        this.props.onItemSelect(item);
                    }}
                    style={styles.item}>
                    <NormalText>{ item }</NormalText>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        this.setState({ item: item, focus: false });
                        Keyboard.dismiss();
                        setTimeout(() => {
                        this.props.onItemSelect(item);
                        if (this.props.resetValue) {
                            this.setState({ focus: true, item: "" });
                            this.input.focus();
                        }
                        }, 0);
                    }}
                >
                { 
                    this.props.selectedItems && this.props.selectedItems.length > 0 && this.props.selectedItems.find(sitem => sitem === item) ?
                        <NormalText>{item}</NormalText>
                        : <NormalText>{item}</NormalText>
                }
                </TouchableOpacity>
            );
        }
    }
  };

  renderListType = () => {
    return this.renderFlatList();
  };

  renderTextInput = () => {
    const textInputProps = { ...this.props.textInputProps };
    const oldSupport = [
      { key: 'ref', val: e => (this.input = e) }, 
      { key: 'onChangeText', val: (text) => { this.searchedItems(text) } }, 
      { key: 'underlineColorAndroid', val: this.props.underlineColorAndroid }, 
      { 
        key: 'onFocus', 
        val: () => {
          this.props.onFocus && this.props.onFocus()
          this.setState({
            focus: true,
            item: "",
            listItems: this.props.items
          });
        } 
      }, 
      {
        key: 'onBlur',
        val: () => {
          this.props.onBlur && this.props.onBlur(this);
          this.setState({ focus: false, item: this.props.selectedItems });
        }
      },
      {
        key: 'value',
        val: this.state.item ? this.state.item : ''
      },
      {
        key: 'style',
        val: { ...this.props.textInputStyle }
      },
      {
        key: 'placeholderTextColor',
        val: this.props.placeholderTextColor
      },
      {
        key: 'placeholder',
        val: this.props.placeholder
      }
    ];

    oldSupport.forEach((kv) => {
      if(!Object.keys(textInputProps).includes(kv.key)) {
        if(kv.key === 'onTextChange' || kv.key === 'onChangeText') {
          textInputProps['onChangeText'] = kv.val;
        } else {
          textInputProps[kv.key] = kv.val;
        }
      } else {
        if(kv.key === 'onTextChange' || kv.key === 'onChangeText') {
          textInputProps['onChangeText'] = kv.val;
        }
      }
    });

    return (
      <TextInput
        { ...textInputProps }
        placeholder="Type a tag ..."
        leftContent={
            <Ionicons name="pricetag" size={20}/>
        }
        onBlur={(e) => {
            if (this.props.onBlur) {
                this.props.onBlur(e);
            }

            if (this.props.textInputProps && this.props.textInputProps.onBlur) {
                this.props.textInputProps.onBlur(e);
            }
            
            this.setState({ focus: false, item: this.props.selectedItems });
        }}
      />
    )
  }

  render = () => {
    return (
      <View
        keyboardShouldPersist="always"
        style={{ padding: 10 }}
      >
        { this.renderTextInput() }
        { this.renderListType() }
        { this.renderSelectedItems() }
      </View>
    );
  };

  renderSelectedItems() {
    let items = this.props.selectedItems || [];
    if (items !== undefined && items.length > 0 && this.props.chip && this.props.multi) {
        return (
            <View style={styles.itemDisplay}>
                    { items.map((item, index) => {
                        return (
                            <View key={index} style={styles.tag}>
                                <SmallText color="white">{item}</SmallText>
                                <TouchableOpacity onPress={() => this.props.onRemoveItem(item, index)} style={styles.close}>
                                    <Ionicons name="close" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        )
                    })}
            </View>
        );
    }
  }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#5DB075',
        borderRadius: 5,
        marginTop: 2
    },

    itemDisplay: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 10,
        marginTop: 5
    },

    tag: {
        justifyContent: 'center',
        flex: 0,
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 2,
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },

    close: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    }
});