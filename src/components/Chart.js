import React, { useState } from 'react';
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  Crosshair,
  LineSeries,
} from 'react-vis';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import 'react-vis/dist/style.css';

export default function Chart(props) {
  const DATA = props.data.map((obj) => ({ x: obj.at, y: obj.value }));

  const [crosshairValues, setCrosshairValues] = useState();
  const onMouseLeave = () => {
    setCrosshairValues();
  };
  const onNearestX = (value, { index }) => {
    console.log(DATA[index]);
    setCrosshairValues(DATA[index]);
  };

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
        Historical Data for:
          {' '}
          {props.name}
        </Typography>
        <FlexibleWidthXYPlot onMouseLeave={onMouseLeave} height={300} xType="time">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <LineSeries onNearestX={onNearestX} data={DATA} />

          <Crosshair
            titleFormat={(d) => ({ title: 'Time', value: new Date(d[0].x).toLocaleTimeString() })}
            itemsFormat={(d) => [{ title: 'Value', value: d[0].y }]}
            values={[crosshairValues]}
          />
        </FlexibleWidthXYPlot>
      </CardContent>
    </Card>
  );
}
