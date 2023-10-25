import { useState, memo } from "react";
import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import TrashIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import UnlockIcon from "@mui/icons-material/LockOpen";
import VisibleIcon from "@mui/icons-material/Visibility";
import VisibleOffIcon from "@mui/icons-material/VisibilityOff";
import styles from "../../styles/regionSelectorSidebarBox-styles";
import isEqual from "lodash/isEqual";
import { LuArrowDownUp } from "react-icons/lu";
import { FaTrash } from "react-icons/fa";

const theme = createTheme();
const useStyles = makeStyles((theme) => styles);

const Chip = ({ color, text }) => {
  const classes = useStyles();
  return (
    <span className={classes.chip}>
      <div className="color" style={{ backgroundColor: color }} />
      <div className="text">{text}</div>
    </span>
  );
};

const RowLayout = ({
  header,
  highlighted,
  order,
  classification,
  area,
  tags,
  trash,
  lock,
  visible,
  onClick,
}) => {
  const classes = useStyles();
  const [mouseOver, changeMouseOver] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
      className="mb-2"
    >
      <div className="w-full flex items-center">
        <div className="flex items-center justify-center w-1/12 text-right">
          {order}
        </div>
        <div className="flex items-center justify-start flex-grow">
          {classification}
        </div>
        <div className="flex items-center justify-center w-1/12">{trash}</div>
        {/* <div className="flex items-center justify-center w-1/12">{lock}</div>
        <div className="flex items-center justify-center w-1/12">{visible}</div> */}
      </div>
      {/* <Grid container alignItems="center">
        <Grid item xs={2}>
          <div style={{ textAlign: "right", paddingRight: 10 }}>{order}</div>
        </Grid>
        <Grid item xs={5}>
          {classification}
        </Grid>
        <Grid item xs={2}>
          <div style={{ textAlign: "right", paddingRight: 6 }}>{area}</div>
        </Grid>
        <Grid item xs={1}>
          {trash}
        </Grid>
        <Grid item xs={1}>
          {lock}
        </Grid>
        <Grid item xs={1}>
          {visible}
        </Grid>
      </Grid> */}
    </div>
  );
};

const RowHeader = () => {
  return (
    <RowLayout
      header
      highlighted={false}
      order={<LuArrowDownUp />}
      classification={<div style={{ paddingLeft: 10 }}>Class</div>}
      // area={<PieChartIcon className="icon" />}
      trash={<FaTrash />}
      // lock={<LockIcon className="icon" />}
      // visible={<VisibleIcon className="icon" />}
    />
  );
};

const MemoRowHeader = memo(RowHeader);

const Row = ({
  region: r,
  highlighted,
  onSelectRegion,
  onDeleteRegion,
  onChangeRegion,
  visible,
  locked,
  color,
  cls,
  index,
}) => {
  return (
    <RowLayout
      header={false}
      highlighted={highlighted}
      onClick={() => onSelectRegion(r)}
      order={`#${index + 1}`}
      classification={<Chip text={cls || ""} color={color || "#ddd"} />}
      area=""
      trash={<TrashIcon onClick={() => onDeleteRegion(r)} className="icon2" />}
      lock={
        r.locked ? (
          <LockIcon
            onClick={() => onChangeRegion({ ...r, locked: false })}
            className="icon2"
          />
        ) : (
          <UnlockIcon
            onClick={() => onChangeRegion({ ...r, locked: true })}
            className="icon2"
          />
        )
      }
      visible={
        r.visible || r.visible === undefined ? (
          <VisibleIcon
            onClick={() => onChangeRegion({ ...r, visible: false })}
            className="icon2"
          />
        ) : (
          <VisibleOffIcon
            onClick={() => onChangeRegion({ ...r, visible: true })}
            className="icon2"
          />
        )
      }
    />
  );
};

const MemoRow = memo(
  Row,
  (prevProps, nextProps) =>
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.visible === nextProps.visible &&
    prevProps.locked === nextProps.locked &&
    prevProps.id === nextProps.id &&
    prevProps.index === nextProps.index &&
    prevProps.cls === nextProps.cls &&
    prevProps.color === nextProps.color
);

const emptyArr = [];

export const RegionSelectorSidebarBox = ({
  regions = emptyArr,
  onDeleteRegion,
  onChangeRegion,
  onSelectRegion,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <MemoRowHeader />
      {regions.map((r, i) => {
        console.log(r);
        return (
          <MemoRow
            key={r.id}
            {...r}
            region={r}
            index={i}
            onSelectRegion={onSelectRegion}
            onDeleteRegion={onDeleteRegion}
            onChangeRegion={onChangeRegion}
          />
        );
      })}
    </div>
    // <ThemeProvider theme={theme}>
    //   <SidebarBoxContainer
    //     title="Regions"
    //     subTitle=""
    //     icon={<RegionIcon style={{ color: grey[700] }} />}
    //     expandedByDefault
    //   >
    //     <div className={classes.container}>
    //       <MemoRowHeader />
    //       <HeaderSep />
    //       {regions.map((r, i) => (
    //         <MemoRow
    //           key={r.id}
    //           {...r}
    //           region={r}
    //           index={i}
    //           onSelectRegion={onSelectRegion}
    //           onDeleteRegion={onDeleteRegion}
    //           onChangeRegion={onChangeRegion}
    //         />
    //       ))}
    //     </div>
    //   </SidebarBoxContainer>
    // </ThemeProvider>
  );
};

const mapUsedRegionProperties = (r) => [
  r.id,
  r.color,
  r.locked,
  r.visible,
  r.highlighted,
];

export default memo(RegionSelectorSidebarBox, (prevProps, nextProps) =>
  isEqual(
    (prevProps.regions || emptyArr).map(mapUsedRegionProperties),
    (nextProps.regions || emptyArr).map(mapUsedRegionProperties)
  )
);
