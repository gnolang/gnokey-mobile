import * as React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

function Gnod(props: SvgProps) {
  return (
    <Svg width={props.width || 16} height={props.height || 18} viewBox="0 0 37.17128 43.839218" {...props}>
      <G transform="translate(-33.242 -288.7)">
        <Path
          d="M46.354 314.607c-.86-1.062-1.3-6.509-.891-11.04.323-3.59 1.521-9.357 2.175-10.47.41-.698.78-.89 4.564-2.371 3.675-1.44 4.18-1.58 4.7-1.32 1.173.583 1.215 1.552.174 3.958l-.97 2.24 2.838 2.576c3.133 2.842 5.556 5.793 6.442 7.842.474 1.057.477 1.457-.2 1.73-.556.283-1.051.302-1.745.067-2.33-.789-6.84-.007-10.063 1.744-2.137 1.162-4.026 2.776-4.7 4.016-.601 1.104-1.825 1.645-2.324 1.028zm3.725-3.784c1.231-1.05 1.808-1.618 4.9-2.829 4.035-1.579 5.843-1.619 8.45-1.038.813.181 1.516.243 1.562.138.42-.963-4.22-6.518-7.989-9.565-1.029-.831-1.88-1.534-1.89-1.561-.01-.027.485-1.222 1.1-2.656.976-2.271 1.062-2.657.665-2.996-.427-.364-.71-.29-4.362 1.14-3.362 1.315-3.954 1.617-4.248 2.16-.589 1.087-1.832 7.446-2.079 10.632-.314 4.05.108 9.297.787 9.808.159.119.534-.234.97-.913.39-.609 1.35-1.652 2.134-2.32z"
          fill="#000"
          stroke="#000"
          strokeWidth={1.2}
          strokeDasharray="none"
          strokeOpacity={1}
        />
        <Path
          d="M59.151 326.75c-3.816-.868-6.94-1.713-7.665-2.074-1.915-.955-3.535-3.55-3.659-5.862-.063-1.188 1.112-3.796 1.838-4.08.434-.17.56-.036.984 1.044.677 1.73 1.078 1.645 2.993-.633 1.398-1.662 1.744-1.934 3.17-2.492s1.874-.594 4.075-.33c2.937.353 3.363.094 2.685-1.638-.604-1.542-.027-1.788 2.057-.875 2.268.994 3.408 2.56 3.661 5.029.205 1.994-.327 3.361-2.728 7.005-3.848 5.841-3.705 5.747-7.411 4.905zm6.231-4.59c1.415-2.15 2.684-4.213 2.82-4.585.722-1.965.212-4.67-1.138-6.039-.357-.363-1.201-.885-1.874-1.16l-1.224-.5.398 1.017c.448 1.146.218 1.979-.64 2.315-.31.122-1.546.071-2.744-.112-3.524-.539-4.865.058-7.3 3.248-.476.624-1.141 1.242-1.478 1.374-.903.353-1.814-.2-2.096-1.276-.203-.772-.279-.841-.562-.51-.936 1.098-1.17 3.47-.506 5.156.474 1.206 2.305 2.744 3.856 3.24 3.312 1.056 8.677 2.199 9.28 1.975.419-.155 1.514-1.57 3.208-4.144z"
          fill="gray"
          fillOpacity={1}
          stroke="none"
        />
        <Path
          d="M61.863 326.3c-1.675-.03-8.433-1.64-9.739-2.322-.997-.52-1.87-1.214-2.49-1.978-.387-.476-.567-.814-.716-1.345-.366-1.306-.289-2.846.2-3.953.171-.391.5-.881.62-.929.1-.038.196.135.317.567.253.903.767 1.428 1.458 1.486.678.058 1.27-.332 2.124-1.398 1.233-1.541 1.688-2.024 2.446-2.593.42-.316 1.274-.69 1.804-.79.762-.144 1.548-.13 2.91.051 2.198.293 2.87.27 3.344-.111.322-.26.475-.643.463-1.16-.005-.22-.047-.372-.305-1.087l-.299-.831.937.405c1.589.687 2.236 1.184 2.775 2.13.247.433.611 1.482.695 2 .17 1.048.098 2.189-.19 3.01-.101.29-.44.883-1.249 2.181-2.034 3.268-3.809 5.798-4.508 6.427-.261.236-.284.245-.597.24z"
          fill="gray"
          fillOpacity={1}
          stroke="gray"
          strokeWidth={0.123433}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={1}
        />
        <Rect
          width={8.7040815}
          height={12.897045}
          x={33.856575}
          y={321.53244}
          ry={1.1818035}
          fill="gray"
          fillOpacity={1}
          stroke="gray"
          strokeWidth={1.22998}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={1}
        />
        <Rect
          width={2.2979565}
          height={10.095428}
          x={40.179031}
          y={313.39539}
          ry={1.4526443}
          fill="gray"
          fillOpacity={1}
          stroke="gray"
          strokeWidth={1.39732}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={1}
        />
      </G>
    </Svg>
  )
}

export default Gnod
