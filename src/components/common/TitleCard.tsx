/**
 * @file TitleCard.tsx
 * @desc 제목과 내용을 구분하는 카드 UI 컴포넌트
 */
import type { ReactNode, ReactElement } from "react";

/**
 * CardProps - TitleCard 컴포넌트 props
 * @property {string} title - 카드 제목
 * @property {ReactNode} children - 카드 내용
 */
interface CardProps {
  title: string;
  children: ReactNode;
}

/**
 * TitleCard - 제목과 내용을 구분하는 카드 UI
 * @param {CardProps} props
 */
const TitleCard = ({ title, children }: CardProps): ReactElement => (
  <section className="bg-white border border-solid border-borderCard rounded-card">
    {/* Title */}
    <div className="px-4 py-2 bg-card rounded-t-card">
      <h2 className="font-semibold text-left text-cardTitle">{title}</h2>
    </div>
    {/* Content */}
    <div className="flex-col p-4">{children}</div>
  </section>
);

export default TitleCard;
