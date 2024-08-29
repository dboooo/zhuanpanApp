interface WheelItem {
    type: string, // 
    title: string,
    prizes: ItemConfig[],
}

interface ItemConfig {
    range: number;
    background: string;
    fonts: {
      text: string;
      top: number;
      fontColor: string;
      fontSize: string; 
      fontStyle: string; 
      fontWeight: string | number; 
      lineHeight: string; 
      wordWrap: string; 
      lengthLimit?: number; 
      lineClamp?: number;
    };
    imgs: {
      src: string;
      top: number;
      width: string; 
      height: string; 
    }[];
}