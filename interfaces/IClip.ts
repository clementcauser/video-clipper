import { Timestamp } from "firebase/firestore";
import { ITag } from "./ITag";

export interface IClip {
  uid: string;
  title: string;
  url: string;
  startTime: number;
  endTime: number;
  tags?: ITag[];
  authorId: string;
  lastUpdate: Timestamp;
}
