import * as React from "react";

const TrashIcon = ({ color = "#CC3B3B", ...props }) => {
  return (
    <svg
      style={{ cursor: "pointer" }}
      width="17"
      height="19"
      viewBox="0 0 17 19"
      fill="none"
      {...props}
    >
      <g opacity="0.85">
        <path
          d="M2.42469 5.57884L2.41912 5.5838L2.41373 5.58898C2.2341 5.76154 2.14949 6.01018 2.18597 6.25597L3.31222 16.0676L3.31257 16.0704C3.46933 17.3543 4.56377 18.3166 5.85702 18.3078H11.3152C12.644 18.3252 13.7628 17.3175 13.8839 15.994C13.8839 15.9937 13.8839 15.9935 13.8839 15.9932L14.8159 6.19712L14.8166 6.18915L14.8171 6.18116C14.8291 5.96209 14.7469 5.74818 14.591 5.5935L14.5835 5.58599L14.5755 5.5789C14.4095 5.4309 14.1915 5.35551 13.97 5.36907H3.03021C2.80869 5.35551 2.59067 5.43091 2.42469 5.57884Z"
          fill={color} 
          stroke={color} 
          strokeWidth="0.8"
        />
        <path
          d="M9.94596 0.60105L9.94598 0.601051C10.8342 0.632952 11.5289 1.37675 11.5011 2.26413V2.5511H15.5665C16.0267 2.5511 16.4 2.92416 16.4 3.38459C16.4 3.84494 16.0268 4.21811 15.5665 4.21811H1.43353C0.973175 4.21811 0.6 3.84494 0.6 3.38459C0.6 2.92424 0.973176 2.55106 1.43353 2.55106H5.49886V2.2641C5.49804 2.23763 5.49784 2.21091 5.49835 2.18402L9.94596 0.60105ZM9.94596 0.60105C9.91826 0.600057 9.89028 0.599754 9.86212 0.600212M9.94596 0.60105L9.86212 0.600212M9.86212 0.600212H7.13783C6.24846 0.585888 5.5149 1.29409 5.49835 2.18387L9.86212 0.600212ZM7.16587 2.26727H9.83409V2.55106H7.16587V2.26727Z"
          fill={color} 
          stroke={color} 
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
};

export default TrashIcon;

