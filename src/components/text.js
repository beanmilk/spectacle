import React, { Component, PropTypes } from "react";
import { getStyles } from "../utils/base";
import Radium from "radium";

@Radium
export default class Text extends Component {
  constructor() {
    super();
    this.resize = this.resize.bind(this);
    this.state = {
      scale: 1,
      height: 16
    };
  }
  componentDidMount() {
    this.resize();
    window.addEventListener("load", this.resize);
    window.addEventListener("resize", this.resize);
  }
  componentWillReceiveProps() {
    this.resize();
  }
  componentWillUnmount() {
    window.removeEventListener("load", this.resize);
    window.removeEventListener("resize", this.resize);
  }
  resize() {
    if (this.props.fit) {
      const text = this.textRef;
      const container = this.containerRef;
      text.style.display = "inline-block";
      const scale = (container.offsetWidth / text.offsetWidth);
      const height = (text.offsetHeight * scale) || 0;
      text.style.display = "block";
      this.setState({
        scale,
        height
      });
    }
  }
  render() {
    const { lineHeight, fit, style, children } = this.props;
    const styles = {
      container: {
        display: "block",
        width: "100%",
        height: this.state.height
      },
      text: {
        fontSize: 16,
        display: "block",
        margin: "0",
        padding: "0",
        lineHeight,
        transform: `scale(${this.state.scale})`,
        transformOrigin: "center top"
      },
      nonFit: {
      }
    };
    const typefaceStyle = this.context.typeface || {};
    return (
      fit ? (
        <div
          className={this.props.className}
          ref={(c) => { this.containerRef = c; }}
          style={[this.context.styles.components.text, getStyles.call(this), styles.container]}
        >
          <span
            ref={(t) => { this.textRef = t; }}
            style={[styles.text, style, typefaceStyle]}
          >
            {children}
          </span>
        </div>
      ) : (
        <p className={this.props.className} style={[this.context.styles.components.text, getStyles.call(this), styles.nonFit, style, typefaceStyle]}>
          {children}
        </p>
      )
    );
  }
}

Text.defaultProps = {
  lineHeight: 1
};

Text.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  fit: PropTypes.bool,
  lineHeight: PropTypes.number,
  style: PropTypes.object
};

Text.contextTypes = {
  styles: PropTypes.object,
  store: PropTypes.object,
  typeface: PropTypes.object
};
