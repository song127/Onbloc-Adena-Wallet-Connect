/**
 * @file Gap.tsx
 * @desc 여백(Spacing) 유틸 컴포넌트
 */
import clsx from "clsx";
import type { ReactElement } from "react";

// tailwind spacing key (숫자, 소수, 문자 모두 허용)
type SpacingKey = string | number;

/**
 * GapProps - 여백 props
 * @property {SpacingKey} [w] - 가로 여백(px)
 * @property {SpacingKey} [h] - 세로 여백(px)
 */
interface GapProps {
  w?: SpacingKey;
  h?: SpacingKey;
}

/**
 * Gap - 여백(Spacing) 유틸
 * @param {GapProps} props
 */
const Gap = ({ w, h }: GapProps): ReactElement => (
  <div className={clsx(w !== undefined && `mr-${w}`, h !== undefined && `mb-${h}`)} />
);

export default Gap;
