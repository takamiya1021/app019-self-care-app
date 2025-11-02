import { StretchGuide } from '@/types'

export const stretchGuides: StretchGuide[] = [
  {
    target: 'shoulder-pain',
    name: '肩こり解消ストレッチ',
    description: 'デスクワークの合間に。肩甲骨周りをほぐし、肩こりを和らげるストレッチです。',
    exercises: [
      {
        id: 1,
        name: '胸張りストレッチ',
        instruction: '両手を後ろで組み、肩甲骨を寄せるように胸を張ります。ゆっくりと深呼吸しながら20秒キープしましょう。',
        duration: 20,
      },
      {
        id: 2,
        name: '首の横伸ばし（右）',
        instruction: '左手を頭の上に回し、ゆっくりと首を右に倒して20秒キープします。',
        duration: 20,
      },
      {
        id: 3,
        name: '首の横伸ばし（左）',
        instruction: '右手を頭の上に回し、ゆっくりと首を左に倒して20秒キープします。',
        duration: 20,
      },
    ],
    totalDuration: 60,
    location: 'anywhere',
  },
  {
    target: 'back-pain',
    name: '腰痛緩和ストレッチ',
    description: '座ったままでできる、腰やお尻の筋肉をほぐすストレッチです。',
    exercises: [
      {
        id: 1,
        name: 'お尻のストレッチ（右）',
        instruction: '椅子に浅く座り、右足首を左膝に乗せます。上体をゆっくりと前に倒し、お尻の伸びを感じながら30秒キープします。',
        duration: 30,
      },
      {
        id: 2,
        name: 'お尻のストレッチ（左）',
        instruction: '椅子に浅く座り、左足首を右膝に乗せます。上体をゆっくりと前に倒し、お尻の伸びを感じながら30秒キープします。',
        duration: 30,
      },
      {
        id: 3,
        name: '体側伸ばし',
        instruction: '片方の腕を上げて、ゆっくりと体を横に倒します。体側が伸びるのを感じながら20秒キープします。反対側も同様に行います。',
        duration: 40, // 左右20秒ずつ
      },
    ],
    totalDuration: 100,
    location: 'office',
  },
  {
    target: 'eye-strain',
    name: '眼精疲労スッキリ',
    description: '目の周りの筋肉をほぐし、長時間のPC作業による疲れを和らげます。',
    exercises: [
      {
        id: 1,
        name: '眉下指圧',
        instruction: '両手の親指で眉毛の下の骨のくぼみを優しく指圧します。ゆっくりと円を描くように15秒間マッサージします。',
        duration: 15,
      },
      {
        id: 2,
        name: '目の周りマッサージ',
        instruction: '人差し指と中指で、目の周りの骨に沿って優しくマッサージします。内側から外側へ、ゆっくりと30秒間行います。',
        duration: 30,
      },
      {
        id: 3,
        name: '遠近フォーカス運動',
        instruction: '指を立てて顔の前に置き、指先と遠くの景色を交互に5秒ずつ見つめます。これを3回繰り返しましょう。',
        duration: 30,
      },
    ],
    totalDuration: 75,
    location: 'anywhere',
  },
]

export const getStretchGuide = (target: StretchTarget): StretchGuide => {
  const guide = stretchGuides.find((g) => g.target === target)
  if (!guide) {
    throw new Error(`Stretch guide for ${target} not found`)
  }
  return guide
}
