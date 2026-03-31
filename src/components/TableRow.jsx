function TableRow({ children, sx = {}, style = {}, ...props }) {
  const defaultStyle = {
    // borderBottom: "1px solid #e0e0e0",
    cursor: "default",
    ...sx,
    ...style,
  };
  return (
    <tr style={defaultStyle} {...props}>
      {children}
    </tr>
  );
}

export default TableRow;
