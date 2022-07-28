// Note: this is a modification of the library https://github.com/zubairpaizer/react-native-searchable-dropdown

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

import Tag from './Tag';
import TagsList from './TagsList';
import NormalText from "./NormalText";

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
      const flatListProps = { ...this.props.listProps };
      const oldSupport = [
        { key: 'keyboardShouldPersistTaps', val: 'always' }, 
        { key: 'nestedScrollEnabled', val : false },
        { key: 'style', val : { ...this.props.itemsContainerStyle } },
        { key: 'data', val : this.state.listItems },
        { key: 'keyExtractor', val : (item, index) => index.toString() },
        { key: 'renderItem', val : ({ item, index }) => this.renderItems(item, index) },
      ];
      oldSupport.forEach((kv) => {
        if(!Object.keys(flatListProps).includes(kv.key)) {
          flatListProps[kv.key] = kv.val;
        } else {
          if(kv.key === 'style') {
            flatListProps['style'] = kv.val;
          }
        }
      });
      return (
        <FlatList
          { ...flatListProps }
          style={{ maxHeight: 200 }}
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
                    <NormalText color="white">{ item }</NormalText>
                </TouchableOpacity>

                : <TouchableOpacity
                    onPress={() => {
                        console.log("Hit");
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
                        console.log("Hit");
                        this.setState({ item: item, focus: false });
                        Keyboard.dismiss();
                        this.props.onItemSelect(item);
                        if (this.props.resetValue) {
                            this.setState({ focus: true, item: "" });
                            this.input.focus();
                        }
                    }}
                >
                  <NormalText>{ item }</NormalText>
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
        containerStyle={{ marginBottom: 10 }}
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
      if (this.props.inline) {
        return <TagsList tags={items} remove={this.props.onRemoveItem}/>
      } else {
        return (
          <View style={styles.itemDisplay}>
            { items.map((tag, i) => 
              <Tag key={i} text={tag} remove={() => this.props.onRemoveItem(tag, i)}/>
            )}
          </View>
        );
      }
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
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },

    close: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    }
});