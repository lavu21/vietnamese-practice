import { Audience, ErrorCategory, Tone } from "./types";

export const SAMPLE_TEXT =
  "Hôm nay tôi đi học sớm vì tôi thứt dậy sớm. Tôi nghỉ rằng nếu đi sớm thì sẽ không bị kẹt xe, nhưng thật ra hôm nay đường lại đông hơn mọi khi. Trên đường đi, tôi gặp bạn be cũ và chúng tôi nói chuyện rất vui.";

/** 0 lỗi — bài viết "sạch" để test trạng thái không tìm thấy lỗi nào. */
export const SAMPLE_ZERO_ERRORS_TEXT =
  "Cuối tuần này, gia đình tôi có kế hoạch đi dã ngoại. Chúng tôi chọn một công viên gần nhà để nghỉ ngơi. Buổi sáng, mọi người thức dậy sớm để chuẩn bị đồ ăn nhẹ. Chúng tôi mang theo bánh mì và nước uống. Ngoài ra, cả nhà còn mang một tấm bạt để trải trên bãi cỏ. Khi đến nơi, không khí trong lành khiến ai cũng cảm thấy thoải mái. Bố tôi chơi cầu lông với em trai. Mẹ và tôi thì ngồi trò chuyện dưới bóng cây. Buổi trưa, cả nhà cùng ăn trưa và chụp vài tấm ảnh kỷ niệm. Đây thực sự là một ngày cuối tuần rất vui và ý nghĩa.";

/** ~8 lỗi (3 ngữ pháp / 2 từ vựng / 3 mạch lạc) — mức trung bình. */
export const SAMPLE_MEDIUM_ERRORS_TEXT =
  "Cuối tuần vừa rồi, tôi cùng nhóm bạn thân đi picnic ở ngoại thành. Hôm đó tôi thứt dậy khá muộn nên suýt trễ giờ hẹn với mọi người. Trên xe, tôi tranh thủ chia sẽ vài tấm ảnh chụp cảnh đẹp cho cả nhóm cùng xem. Khi đến nơi, mọi người dự định đi dạo quanh hồ, nhưng trời bất ngờ đổ mưa nên kế hoạch phải thay đổi ngay lập tức. Cả nhóm đành tìm một quán cà phê gần đó để trú mưa. Có bạn rủ cả nhóm đi coi phim thay vì đi dạo ngoài trời như dự định ban đầu. Trong lúc đó, tôi tình cờ gặp bạn be cũ đang làm phục vụ ở quán, cả hai vui vẻ chào hỏi nhau. Tôi thấy đây cũng là một lựa chọn hay, dù hơi tiếc vì không được ngắm cảnh hồ như mong đợi. Tôi định về sớm để nghỉ ngơi, nhưng cả nhóm rủ ở lại thêm một lúc nên tôi cũng nán lại. Buổi tối, tôi tranh thủ dc thêm thời gian nghỉ ngơi trước khi quay lại guồng công việc bận rộn vào ngày hôm sau.";

/** ~12 lỗi, lệch hẳn về tab Từ vựng (2 ngữ pháp / 8 từ vựng / 2 mạch lạc) — test tab mất cân bằng. */
export const SAMPLE_IMBALANCED_ERRORS_TEXT =
  "Cuối tuần này thật sự bận rộn vì tôi có hẹn gặp rất nhiều bạn be cùng lúc. Buổi sáng, tôi hẹn một nhóm bạn be cũ ra quán cà phê để ôn lại kỷ niệm thời sinh viên. Sau đó, cả nhóm rủ nhau đi coi phim ở rạp gần trung tâm thương mại. Đến chiều, tôi lại có một nhóm bạn khác rủ đi coi phim tiếp vì bộ phim mới ra rất hot. Trong lúc chờ vào rạp, mọi người ngồi bàn về công việc, có người nói rằng cần cọ sát thực tế nhiều hơn mới học được kinh nghiệm. Tôi cũng đồng ý và nói thêm rằng bản thân mình cũng đang thiếu sự cọ sát với môi trường làm việc thực sự. Có bạn còn chia sẻ rằng công ty mới của bạn ấy đang có kế hoạch phát triển rất sáng lạn trong vài năm tới. Buổi tối, có người hong muốn về sớm nên cả nhóm ở lại thêm một lúc để trò chuyện. Tôi thứt dậy hơi trễ vào sáng hôm sau vì tối hôm trước thức quá khuya. Vì ngủ không đủ giấc, tôi cảm thấy khó có thể sử lý công việc hiệu quả trong buổi sáng đó. Tôi định nghỉ ngơi thêm một chút, nhưng deadline dí quá gần nên đành phải cố gắng tập trung làm việc. Cuối ngày hôm đó, tôi ngồi nhìn lại mọi chuyện đã xảy ra và tự nhủ rằng mình cần sắp xếp thời gian hợp lý hơn trong những tuần tới để tránh rơi vào tình trạng quá tải như vậy nữa.";

/** Bài dài hơn, cố tình chứa nhiều lỗi lặp lại — dùng để test cuộn (scroll) trong feedback panel. */
export const SCROLL_TEST_TEXT =
  "Tuần trước, công ty tôi tổ chức một chuyến đi thực tế để tìm hiểu về ngành công nghệ thông tin tại một chi nhánh mới thành lập. Tôi phải dậy rất sớm để chuẩn bị, nhưng vì tối hôm trước ngủ muộn nên sáng đó tôi thứt dậy trong trạng thái còn khá mệt mỏi. Trước khi ra khỏi nhà, tôi tranh thủ chia sẽ lịch trình cả ngày cho mẹ để bà yên tâm, sau đó mới vội vàng bắt xe cùng mấy bạn be trong nhóm dự án.\n\nTrên xe, mọi người bắt đầu chia sẽ với nhau về những khó khăn gặp phải trong công việc gần đây. Tôi nghĩ rằng buổi đi thực tế lần này sẽ giúp mình hiểu thêm nhiều điều mới, nhưng thật ra trong lòng tôi vẫn còn khá mơ hồ về định hướng nghề nghiệp lâu dài của bản thân. Khi xe dừng trước cổng chi nhánh, cả nhóm nhanh chóng xuống xe và tiến vào bên trong, nơi anh trưởng phòng đã đứng chờ sẵn để đón tiếp mọi người.\n\nAnh trưởng phòng thông báo về kế hoạch sát nhập hai bộ phận kinh doanh và kỹ thuật nhằm giúp guồng máy vận hành trơn tru hơn trong tương lai gần. Anh nói rằng nếu mọi việc suôn sẻ, con đường phía trước của công ty sẽ rất sáng lạn, còn nếu không cẩn thận thì rủi ro cũng không hề nhỏ chút nào. Nhiều người trong nhóm tỏ ra rất hào hứng với kế hoạch mới, nhưng cũng có không ít người âm thầm lo lắng về những thay đổi lớn sắp diễn ra trong thời gian tới đây.\n\nTôi ngồi nghe mà thấy hơi lo, bởi bản thân mình mới đi làm dc vài tháng, chưa có nhiều kinh nghiệm sử lý những tình huống phức tạp như thế. Đến giờ nghỉ trưa, cả nhóm rủ nhau đi coi phim gần đó để thư giãn một lát trước khi quay lại làm việc buổi chiều. Trong lúc ngồi chờ vào rạp, chúng tôi tiếp tục chia sẽ thêm về những dự định cá nhân của từng người trong tương lai không xa.\n\nCó người muốn học thêm ngoại ngữ để có cơ hội đi làm việc ở nước ngoài, có người lại muốn chuyển sang nghành khác vì cảm thấy công việc hiện tại không còn phù hợp nữa. Cũng có người hong muốn học thêm gì cả, chỉ muốn dành nhiều thời gian hơn cho gia đình và bản thân sau một thời gian dài làm việc quá sức. Tôi thì vẫn chưa biết chắc mình thứt dậy sớm mỗi ngày để hướng tới điều gì, chỉ biết cứ cố gắng từng chút một.\n\nBuổi chiều, chúng tôi quay lại văn phòng tham gia một buổi họp khá dài, xoay quanh việc cọ sát giữa lý thuyết được học ở trường và thực tế công việc tại doanh nghiệp. Buổi họp kéo dài gần hai tiếng đồng hồ với rất nhiều nội dung quan trọng được trình bày liên tục khiến ai nấy đều cảm thấy khá đuối sức nhưng vẫn cố gắng tập trung lắng nghe đến tận phút cuối cùng. Có bạn chia sẽ rằng bạn ấy từng nghĩ công việc văn phòng sẽ nhẹ nhàng, nhưng thực tế lại áp lực hơn rất nhiều so với những gì bạn ấy từng tưởng tượng lúc mới ra trường.\n\nKết thúc buổi họp, sếp tổng kết lại và nói rằng tựu chung, điều quan trọng nhất vẫn là thái độ làm việc và tinh thần học hỏi không ngừng của mỗi cá nhân trong tổ chức. Khi ra về, tôi vừa đi vừa suy nghĩ về rất nhiều điều đã xảy ra trong ngày hôm đó, từ chuyện công việc cho đến những dự định tương lai mà bản thân vẫn chưa thật sự rõ ràng. Tôi tự hỏi liệu mình có thể theo kịp guồng quay công việc ko nữa hay không, nhưng cuối cùng vẫn tự nhủ sẽ cố gắng hết sức để không phụ lòng những người đã tin tưởng giao việc cho mình ngay từ những ngày đầu.";

export const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "professional", label: "Chuyên nghiệp" },
  { value: "casual", label: "Đời thường" },
];

export const AUDIENCE_OPTIONS: { value: Audience; label: string; icon: string }[] = [
  { value: "adult", label: "Người lớn", icon: "🧑" },
  { value: "child", label: "Trẻ con", icon: "🧒" },
  { value: "colleague", label: "Đồng nghiệp", icon: "💼" },
  { value: "close-friend", label: "Bạn bè thân thiết", icon: "😄" },
];

export const CATEGORY_ORDER: ErrorCategory[] = ["grammar", "vocab", "coherence"];

export const CATEGORY_META: Record<ErrorCategory, { label: string; color: string }> = {
  grammar: { label: "Ngữ pháp", color: "var(--color-grammar)" },
  vocab: { label: "Từ vựng", color: "var(--color-vocab)" },
  coherence: { label: "Lập luận & Mạch lạc", color: "var(--color-coherence)" },
};

/**
 * 5 bài mẫu cố định với số lỗi khác nhau để demo/test các trạng thái của feedback panel
 * (rỗng, ít, vừa, lệch tab, dài).
 */
export interface MockSample {
  id: string;
  label: string;
  description: string;
  text: string;
}

export const MOCK_SAMPLES: MockSample[] = [
  {
    id: "zero",
    label: "0 lỗi",
    description: "Bài viết sạch — không có lỗi nào",
    text: SAMPLE_ZERO_ERRORS_TEXT,
  },
  {
    id: "few",
    label: "Ít lỗi (~3)",
    description: "1 ngữ pháp · 1 từ vựng · 1 mạch lạc",
    text: SAMPLE_TEXT,
  },
  {
    id: "medium",
    label: "Trung bình (~8)",
    description: "3 ngữ pháp · 2 từ vựng · 3 mạch lạc",
    text: SAMPLE_MEDIUM_ERRORS_TEXT,
  },
  {
    id: "imbalanced",
    label: "Nhiều, lệch tab (~12)",
    description: "2 ngữ pháp · 8 từ vựng · 2 mạch lạc",
    text: SAMPLE_IMBALANCED_ERRORS_TEXT,
  },
  {
    id: "scroll",
    label: "Rất nhiều (~23)",
    description: "12 ngữ pháp · 5 từ vựng · 6 mạch lạc — test cuộn panel",
    text: SCROLL_TEST_TEXT,
  },
];

/** Chưa có backend auth thật — dùng tài khoản giả cố định để demo đăng nhập. */
export interface MockUser {
  username: string;
  password: string;
}

export const MOCK_USERS: MockUser[] = [{ username: "demo", password: "demo123" }];
