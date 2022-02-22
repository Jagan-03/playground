import useMeasure from "react-use-measure";

// Visx Components
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { BarRounded, BarStack } from "@visx/shape";
import { HtmlLabel } from "@visx/annotation";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";

// Material UI components
import styled from "styled-components";
import { Box } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

//Mock data
import data from "../../library/LearningOutcomeSummary/learningOutcomeSummary";

// margins
const margin = {
  top: 41,
  bottom: 57,
  left: 20,
  right: 21,
};

// width and height
const defaultWidth = 100;
const defaultHeight = 100;

// MUI Styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    widgetWrapper: {
      width: 585,
      height: 244,
    },
    totalLabelWrapper: {
      height: 38,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    legendWrapper: {
      position: "absolute",
      top: 16,
      height: 14,
      display: "flex",
      justifyContent: "end",
    },
    legendItemWrapper: {
      display: "flex",
      flexDirection: "row",
    },
  })
);

// Styled components
const TotalLabelTitle = styled.p`
  font-family: "Source Sans Pro";
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  height: 11px;
`;
const TotalLabelSubTitle = styled.p`
  font-family: "Source Sans Pro";
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  height: 14px;
  letter-spacing: -0.5px;
`;
const LegendLabelText = styled.p`
  font-family: "Source Sans Pro";
  font-weight: 400;
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  color: #6d8199;
`;

const roundNumber = (num: number) => Math.round(num / 10) * 10;

const LearningOutcomeSummary = () => {
  const [ref, bounds] = useMeasure();
  const classes = useStyles();

  const width = bounds.width || defaultWidth;
  const height = bounds.height || defaultHeight;

  // innerwidth and innerheight
  const innerWidth = width - margin.left;
  const innerHeight = height - margin.bottom;

  const achievedColor = "#40B8F4";
  const notAchievedColor = "#EF0061";
  const barWidth = 26;
  const barRadius = 6;
  const legendShapeWidth = 10;
  const legendShapeHeight = 10;

  const keys = Object.keys(data[0]).filter((d) => d !== "skill");
  const achievementTotals = data.reduce((totals, skill) => {
    totals.push(skill.achieved + skill.notAchieved);
    return totals;
  }, [] as number[]);
  const maxScore = roundNumber(Math.max(...achievementTotals));
  const axisLeftNumTick = Math.floor(maxScore / 20);

  // Defining scales
  const xScale = scaleBand<string>({
    range: [margin.left, innerWidth],
    domain: data.map((d) => d.skill),
    padding: 0.7,
  });
  const zScale = scaleBand<string>({
    range: [margin.left, innerWidth],
    padding: 0.7,
  });
  const yScale = scaleLinear<number>({
    domain: [0, maxScore],
    range: [innerHeight, margin.bottom],
  });
  const colorScale = scaleOrdinal({
    domain: data.map((d) => d.skill),
    range: [notAchievedColor, achievedColor],
  });
  const ordinalColorScale = scaleOrdinal({
    domain: ["Achieved", "Not Achieved"],
    range: [achievedColor, notAchievedColor],
  });
  const bottomAxisYscale = [...Array(axisLeftNumTick)].map(
    (tick, i) => (i + 1) * roundNumber(maxScore / axisLeftNumTick)
  );

  // Axis Tick Label Props
  const bottomTickLabelProps = () =>
    ({
      fontSize: 14,
      fontFamily: "Source Sans Pro",
      letterSpacing: "-0.5",
      fontWeight: 600,
      lineHeight: 16,
      width: 90,
      transform: "translate(0, 10)",
      textAnchor: "middle",
    } as const);
  const leftTickLabelProps = () =>
    ({
      fontSize: 12,
      fontWeight: 400,
      color: "#6D8199",
      transform: "translate(7, -5)",
    } as const);

  // Annotation Label Props
  const htmlLabelContainerStylesForTotal = {
    width: 44,
    height: 38,
    background: "#37BA00",
    borderRadius: 18,
    borderBottomLeftRadius: 6,
  };
  const htmlLabelContainerStylesForAchieved = {
    width: 26,
    height: 21,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Source Sans Pro",
    fontWeight: 600,
    lineHeight: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    letterSpacing: "-0.5px",
  };

  interface DataObj {
    skill: string;
  }

  const getX = (d: DataObj) => d.skill;

  return (
    <Box className={classes.widgetWrapper}>
      <svg
        ref={ref}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Chart Background */}
        <rect x={0} y={0} width={width} height={height} fill="white" rx={12} />

        {/* Axis Bottom */}
        <Group>
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickLabelProps={bottomTickLabelProps}
            hideTicks={true}
            stroke="#B7B7B7"
          />
          {bottomAxisYscale.map((value) => (
            <AxisBottom
              key={value}
              top={yScale(value)}
              axisLineClassName="axisLine"
              scale={zScale}
              tickLabelProps={bottomTickLabelProps}
              hideTicks={true}
              stroke="#B7B7B7"
              strokeDasharray={`3, 3, 3, 3`}
            />
          ))}
        </Group>
        {/* Axis Bottom */}

        {/* Axis Left */}
        <Group>
          <AxisLeft
            left={margin.left}
            scale={yScale}
            tickLabelProps={leftTickLabelProps}
            hideTicks={true}
            hideAxisLine={true}
            numTicks={axisLeftNumTick}
          />
        </Group>
        {/* Axis Left */}

        {/* Chart Bars */}
        <Group>
          <BarStack
            data={data}
            keys={keys}
            x={getX}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar, i) => {
                  return (
                    <Group key={`bar-stack-${barStack.index}-${bar.index}`}>
                      <BarRounded
                        height={bar?.height}
                        radius={barRadius}
                        width={barWidth}
                        x={bar?.x}
                        y={bar?.y}
                        fill={bar?.color}
                        top={
                          bar?.color === notAchievedColor ||
                          bar?.bar?.data?.notAchieved === 0
                            ? true
                            : false
                        }
                      />
                      {bar?.color === notAchievedColor ? (
                        <HtmlLabel
                          containerStyle={htmlLabelContainerStylesForTotal}
                          horizontalAnchor="start"
                          verticalAnchor="start"
                          anchorLineStroke="none"
                          x={bar?.x}
                          y={bar?.y - 45}
                        >
                          <Box className={classes.totalLabelWrapper}>
                            <TotalLabelTitle>total</TotalLabelTitle>
                            <TotalLabelSubTitle>
                              {bar?.bar?.data?.achieved +
                                bar?.bar?.data?.notAchieved}
                            </TotalLabelSubTitle>
                          </Box>
                        </HtmlLabel>
                      ) : (
                        <HtmlLabel
                          containerStyle={htmlLabelContainerStylesForAchieved}
                          horizontalAnchor="start"
                          verticalAnchor="start"
                          anchorLineStroke="none"
                          x={bar?.x}
                          y={bar?.y}
                        >
                          {bar?.bar?.data?.achieved}
                        </HtmlLabel>
                      )}
                    </Group>
                  );
                })
              )
            }
          </BarStack>
        </Group>
        {/* Chart Bars */}
      </svg>

      {/* Legend */}
      <Box sx={{ width }} className={classes.legendWrapper}>
        <LegendOrdinal scale={ordinalColorScale} labelFormat={(label) => label}>
          {(labels) => (
            <Box className={classes.legendItemWrapper}>
              {labels.map((label, i) => (
                <LegendItem key={`legend-quantile-${i}`} margin="0 5px">
                  <svg width={legendShapeWidth} height={legendShapeHeight}>
                    <rect
                      fill={label.value}
                      width={legendShapeWidth}
                      height={legendShapeHeight}
                      rx={2}
                    />
                  </svg>
                  <LegendLabel align="left" margin="0 12px 0 5px">
                    <LegendLabelText>{label.text}</LegendLabelText>
                  </LegendLabel>
                </LegendItem>
              ))}
            </Box>
          )}
        </LegendOrdinal>
      </Box>
      {/* Legend */}
    </Box>
  );
};

export default LearningOutcomeSummary;
