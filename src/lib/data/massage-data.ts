import { MassageGuide, MassagePart } from '@/types'

const createGuide = (guide: Omit<MassageGuide, 'duration'>): MassageGuide => {
  const totalDuration = guide.steps.reduce((total, step) => total + step.duration, 0)
  return {
    ...guide,
    duration: totalDuration
  }
}

export const massageGuides: Record<MassagePart, MassageGuide> = {
  neck: createGuide({
    part: 'neck',
    name: '首ほぐし',
    description: 'デスクワークで固まりがちな首筋を、優しい圧と呼吸で緩めるセルフケアです。',
    steps: [
      {
        id: 1,
        instruction: '背筋を伸ばし、肩の力を抜きます。両手を後頭部の付け根に添えて、頭の重さを感じながら支えましょう。',
        duration: 30
      },
      {
        id: 2,
        instruction: '右手で左の首筋をつかみ、上から下へゆっくりとさすります。呼吸は止めずに自然なリズムで。',
        duration: 45
      },
      {
        id: 3,
        instruction: '左手で右の首筋を同じようにケアします。親指と四指で筋肉を軽くつまみ、痛みが出ない範囲で動かします。',
        duration: 45
      },
      {
        id: 4,
        instruction: '両手の指先で首の後ろを円を描くようにマッサージし、最後にゆっくりと首を左右に傾けて伸ばします。',
        duration: 40
      }
    ],
    difficulty: 'easy'
  }),

  shoulder: createGuide({
    part: 'shoulder',
    name: '肩甲骨リリース',
    description: '肩甲骨まわりの血行を促し、巻き肩やこりをやわらげるためのマッサージです。',
    steps: [
      {
        id: 1,
        instruction: '右手で左肩の上部をつかみ、呼吸に合わせて軽く押しながら筋肉を温めます。肩を前後に回してほぐしましょう。',
        duration: 45
      },
      {
        id: 2,
        instruction: '左手で右肩も同様に行い、肩甲骨が滑らかに動く感覚を意識します。',
        duration: 45
      },
      {
        id: 3,
        instruction: '両手を肩に乗せ、肘で大きな円を描くように前回し・後ろ回しをそれぞれゆっくり行います。',
        duration: 60
      },
      {
        id: 4,
        instruction: '手を背中で組み、胸を開いて肩甲骨を寄せます。深呼吸をしながら15秒キープし、力を抜きましょう。',
        duration: 30
      }
    ],
    difficulty: 'medium'
  }),

  back: createGuide({
    part: 'back',
    name: '腰背部リフレッシュ',
    description: '腰から背中の緊張をゆるめ、座りっぱなしで重くなった下半身を軽くします。',
    steps: [
      {
        id: 1,
        instruction: '椅子に浅く腰掛け、両手を腰に当てます。親指で腰の筋肉を押しながら、円を描くようにマッサージします。',
        duration: 45
      },
      {
        id: 2,
        instruction: 'こぶしを軽く握り、お尻の横や腰の横をトントンとリズミカルに叩いて血行を促します。',
        duration: 45
      },
      {
        id: 3,
        instruction: '背筋を伸ばし、上体を前に倒して背中全体を伸ばします。息を吐きながら20秒キープ。',
        duration: 40
      },
      {
        id: 4,
        instruction: '両手で腰骨あたりを包み込み、温かさを感じながら深呼吸を3回繰り返しましょう。',
        duration: 30
      }
    ],
    difficulty: 'easy'
  }),

  foot: createGuide({
    part: 'foot',
    name: '足リフレッシュ',
    description: 'ふくらはぎから足裏までを丁寧にケアして、むくみや冷えを和らげます。',
    steps: [
      {
        id: 1,
        instruction: '足首をゆっくり回し、関節をほぐします。左右それぞれ外回し・内回しを行いましょう。',
        duration: 40
      },
      {
        id: 2,
        instruction: 'ふくらはぎを下から上に向かって、手のひらで包み込むようにさすり上げます。血液とリンパの流れを意識。',
        duration: 45
      },
      {
        id: 3,
        instruction: '足裏全体を親指で押し、土踏まずやかかとを気持ちよい強さでほぐします。',
        duration: 45
      },
      {
        id: 4,
        instruction: '足指を一本ずつつかみ、根元から先まで捻る・引っ張る動きを繰り返します。終わったら足を軽く振りましょう。',
        duration: 45
      }
    ],
    difficulty: 'easy'
  }),

  'full-body': createGuide({
    part: 'full-body',
    name: '全身巡りリセット',
    description: '首・肩・背中・足をバランス良くケアし、全身の巡りを整える総合マッサージです。',
    steps: [
      {
        id: 1,
        instruction: '首の側面を耳の下から肩へ向かってさすり下ろし、深呼吸をします。',
        duration: 30
      },
      {
        id: 2,
        instruction: '肩甲骨の内側に指を入れるように押し、肩を回しながらゆっくりほぐします。',
        duration: 45
      },
      {
        id: 3,
        instruction: '腰に手を当て、腰骨の周りを円を描くようにマッサージ。こぶしで軽く叩いて刺激を与えます。',
        duration: 45
      },
      {
        id: 4,
        instruction: 'ふくらはぎをさすり上げ、足首を大きく回します。最後に全身を伸ばしてリフレッシュしましょう。',
        duration: 60
      }
    ],
    difficulty: 'medium'
  })
}

export const getMassageGuide = (part: MassagePart): MassageGuide => {
  return massageGuides[part]
}

export const getAllMassageGuides = (): MassageGuide[] => {
  return Object.values(massageGuides)
}
