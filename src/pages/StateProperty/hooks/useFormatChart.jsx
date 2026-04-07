export function formatToAssetPieChart(data = []) {
  console.log("dataAsset    ", data);
  return data
    ?.filter((_, index) => index > 1)
    .map((item, idx) => ({
      value: item.value,
      name: item.title,
      itemStyle: { color: colorPalette[idx] },
    }));
}

const colorPalette = ["#C0D756", "#FFB300", "#F50057"];
