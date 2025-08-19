function Table({ className, children, sx = {}, style = {}, ...props }) {
  const defaultStyle = {
    ...sx,
    ...style,
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 650,
    fontSize: 14,
    color: "#424242",
  };
  return (
    <table className={className} style={defaultStyle} {...props}>
      {children}
    </table>
  );
}

export default Table;
