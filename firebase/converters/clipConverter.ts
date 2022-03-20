import { IClip } from "@interfaces";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

const clipConverter: FirestoreDataConverter<IClip> = {
  toFirestore(clip: WithFieldValue<IClip>): DocumentData {
    return { uid: clip.uid };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): IClip {
    const data = snapshot.data(options);

    return {
      tags: data.tags,
      uid: snapshot.id,
      endTime: data.endTime,
      startTime: data.startTime,
      url: data.url,
      title: data.title,
    };
  },
};

export default clipConverter;
