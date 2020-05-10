import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // itemss: {
      //     O: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
      //     L: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
      //     J: [[0, 0, 1, 0], [0, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
      //     Z: [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      //     S: [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      //     I: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
      //     T: [[1, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
      // },
      // itemss: {
      //     O: [[1, 1], [1, 1]],
      //     L: [[1, 0], [1, 0], [1, 1]],
      //     J: [[0, 1], [0, 1], [1, 1]],
      //     Z: [[1, 1, 0], [0, 1, 1]],
      //     S: [[0, 1, 1], [1, 1, 0]],
      //     I: [[0, 1], [0, 1], [0, 1], [0, 1]],
      //     T: [[1, 1, 1], [0, 1, 0]]
      // },
      board: [
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      random: "O"
    };
  }
  componentDidMount() {
    const randomArr = arr => arr[Math.floor(Math.random() * arr.length)];
    // setInterval(() => {
    //     this.setState({
    //         random: randomArr(["O", "L", "J", "Z", "S", "I", "T"])
    //     });
    // }, 3000);
  }
  renderItem = board => {
    return (
      <View style={{ margin: 5 }}>
        {board.map((y, yIndex) => (
          <View
            key={yIndex.toString()}
            style={{
              flexDirection: "row"
            }}
          >
            {y.map((x, xIndex) => (
              <View
                key={xIndex.toString()}
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 1,
                  backgroundColor: x === 1 ? "red" : "transparent"
                }}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };
  // _rotate = matrix => {
  //     matrix = matrix.reverse();
  //     for (var i = 0; i < matrix.length; i++) {
  //         for (var j = 0; j < i; j++) {
  //             var temp = matrix[i][j];
  //             matrix[i][j] = matrix[j][i];
  //             matrix[j][i] = temp;
  //         }
  //     }
  //     return matrix;
  // };
  // onPress = item => {
  //     let { itemss } = this.state;
  //     this.setState({
  //         [item]: this._rotate(itemss[item])
  //     });
  // };
  handleItemDown = () => {
    let { board } = this.state;
    let down = true;
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] > 0 && board[y][x] < 10) {
          if (y === board.length - 1 || board[y + 1][x] > 10) {
            down = false;
          }
        }
      }
    }
    if (down) {
      for (let y = board.length - 1; y >= 0; y--) {
        for (let x = 0; x < board[y].length; x++) {
          if (board[y][x] > 0 && board[y][x] < 10) {
            board[y + 1][x] = board[y][x];
            board[y][x] = 0;
          }
        }
      }
      this.setState({
        board
      });
    }
  };
  componentDidMount() {
    this.interval = setInterval(() => this.handleItemDown(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { itemss } = this.state;
    // setInterval(() => this.handleItemDown(), 2000);
    console.log(
      JSON.stringify(this.state.board)
        .replace(/\],/g, "],\n")
        .replace(/\[\[/g, "[\n[")
        .replace(/\]\]/g, "]\n]")
    );
    return (
      <View>
        <Text>Test</Text>
        {this.renderItem(this.state.board)}
        {/* {this.renderItem(itemss.O)}
                {this.renderItem(itemss.L)}
                {this.renderItem(itemss.J)}
                {this.renderItem(itemss.Z)}
                {this.renderItem(itemss.S)}
                {this.renderItem(itemss.I)}
                {this.renderItem(itemss.T)}
                <TouchableOpacity
                    onPress={() => this.onPress(this.state.random)}
                >
                    <Text>Click</Text>
                </TouchableOpacity> */}
      </View>
    );
  }
}
