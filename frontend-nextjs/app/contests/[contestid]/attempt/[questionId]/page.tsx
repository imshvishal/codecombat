"use client";
import { useProtected } from "@/redux/hooks/use-protected";
import {
  useCreateAttemptStatusMutation,
  useCreateSubmissionMutation,
  useGetQuestionQuery,
  useLazyGetQuestionQuery,
  useUpdateAttemptStatusMutation,
} from "@/redux/api/endpoints/contestApi";
import { Spinner } from "@nextui-org/spinner";
import { subtitle, title } from "@/components/primitives";
import MonacoEditor from "@/components/custom/monaco-editor";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button, Chip, Divider, ScrollShadow, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Check, CheckCircle, Hourglass, PlayCircle, Timer, X } from "lucide-react";
import { useSelector } from "react-redux";
import { subtractDuration, timeDifference } from "@/lib/utils";
import { useRouter } from "next/navigation";

const AttemptQuestionPage = ({ params }: { params: { questionId: string; contestid: string } }) => {
  const router = useRouter();
  const start = useRef(Date.now());
  const user = useSelector((state: any) => state.auth.user);
  const languages = ["python", "javascript", "c", "cpp", "java"];
  const [language, setLanguage] = useState("");
  const [editorLoaded, setEeditorLoaded] = useState(false);
  const [timer, setTimer] = useState("");
  const timerRef = useRef("");
  const code = useRef("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isAttempted, setIsAttempted] = useState(false);
  const [createSubmission, { isLoading: isCreatingSubmission, data: submissionData }] = useCreateSubmissionMutation();
  const [createAttemptStatus, { isLoading: isCreatingStatus, error: createError, data: statusData }] = useCreateAttemptStatusMutation();
  const [updateAttemptStatus, { isLoading: isUpdatingStatus }] = useUpdateAttemptStatusMutation();
  const [getQuestion, { data: question, isLoading: questionIsLoading, error: questionError, isError: questionIsError }] = useLazyGetQuestionQuery();

  useEffect(() => {
    getQuestion(params.questionId)
      .unwrap()
      .then((question) => {
        console.log(question);
        //TODO? Add left time of contest if the current time of the question is less than the end time of contest
        setTimer(question.attempt_status?.duration || question?.duration);
        setIsSubmitted(!!question.submission);
        setLanguage(question.submission?.lang || question.attempt_status?.lang || localStorage.getItem("pref_lang") || "python");
        setIsAttempted(!!question.attempt_status);
        code.current = question.submission?.code || question.attempt_status?.code || "";
      });
  }, []);

  useEffect(() => {
    const attemptInterval = setInterval(() => {
      if (!isSubmitted) {
        if (!isAttempted) {
          createAttemptStatus({
            user: user.id,
            duration: timerRef.current,
            question: question.id,
            code: code.current,
            language,
          })
            .unwrap()
            .then((res) => {
              setIsAttempted(true);
            });
        } else {
          updateAttemptStatus({
            id: question.attempt_status?.id || statusData?.id,
            duration: timerRef.current,
            code: code.current,
            language,
          }).unwrap();
        }
      }
    }, 30000);
    return () => clearInterval(attemptInterval);
  }, [question, isAttempted, isSubmitted, statusData, language]);

  useEffect(() => {
    if (!timer || !editorLoaded) return;
    if (timer == "00:00:00") {
      return setIsSubmitted(true);
    }

    const timerInterval = setInterval(() => {
      if (isSubmitted) return clearInterval(timerInterval);
      const regex = /^(\d{2}):(\d{2}):(\d{2})$/;
      const matches = regex.exec(timer);
      if (matches) {
        let [hours, minutes, seconds] = matches.slice(1).map(Number);
        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          seconds = 59;
          minutes -= 1;
        } else if (hours > 0) {
          seconds = 59;
          minutes = 59;
          hours -= 1;
        }
        const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        timerRef.current = time;
        setTimer(time);
        if (hours == 0 && minutes == 0 && seconds == 0) {
          clearInterval(timerInterval);
          handleSubmission().then(() => {
            updateAttemptStatus({
              id: question.attempt_status?.id || statusData?.id,
              duration: timerRef.current,
              code: code.current,
              language,
            }).then(() => {
              setTimeout(() => {
                router.push(`/contests/${params.contestid}`);
              }, 3000);
            });
          });
        }
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timer, isSubmitted, editorLoaded, question?.contest]);

  const handleSubmission = async () => {
    const duration = subtractDuration(question.duration, timerRef.current);

    createSubmission({
      lang: language,
      duration: duration,
      question: question.id,
      code: code.current,
    })
      .unwrap()
      .then((res) => {
        if (res.success == true) {
          setIsSubmitted(true);
          getQuestion(params.questionId).unwrap();
          setTimeout(() => {
            router.push(`/contests/${params.contestid}`);
          }, 3000);
        }
      });
  };

  return (
    <>
      {questionIsLoading ? (
        <Spinner label="Loading..." />
      ) : questionIsError ? (
        <p className={title()}>You can't view this question now.</p>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="rounded-lg">
          <ResizablePanel defaultSize={30}>
            <div className="flex px-8 py-2 flex-col  h-[92vh] text-start gap-5">
              <span className="text-xl">{question?.title}</span>
              <ScrollShadow hideScrollBar>
                <div dangerouslySetInnerHTML={{ __html: question?.description }} />
              </ScrollShadow>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <div className="flex flex-col h-[93vh]">
              <div className="flex justify-between items-center h-[7vh] w-full px-5 text-2xl">
                <div className="text-2xl flex items-center gap-2">
                  <Hourglass size={22} />
                  {question?.submission ? `Time Taken: ${question.submission?.duration}` : `Time Left: ${timer}`}
                  <Chip color={question?.difficulty == "E" ? "success" : question?.difficulty == "M" ? "warning" : "danger"} variant="flat">
                    {question?.difficulty == "E" ? "Easy" : question?.difficulty == "M" ? "Medium" : "Hard"}
                  </Chip>
                </div>
                <Select
                  labelPlacement="outside"
                  className="max-w-52"
                  placeholder="Language"
                  selectedKeys={[language]}
                  isDisabled={isSubmitted}
                  onSelectionChange={(languages: any) => {
                    localStorage.setItem("pref_lang", languages.currentKey);
                    setLanguage(languages.currentKey);
                  }}
                >
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <MonacoEditor
                key={`${question?.submission}-${question?.attempt_status}-${language}`}
                allowAutoComplete={question?.contest.allow_auto_complete}
                language={language}
                defaultValue={code.current}
                isDisabled={isSubmitted}
                onChange={(valCode: string) => (code.current = valCode)}
                onLoad={() => setEeditorLoaded(true)}
              />
              <Divider orientation="horizontal" />
              <div className="flex h-[8vh] justify-between px-5 items-center">
                <div className="flex gap-2" key={submissionData?.testcases}>
                  {submissionData?.error && (
                    <Chip startContent={<X size={15} />} size="sm" color="danger" variant="flat">
                      {submissionData?.error}
                    </Chip>
                  )}
                  {submissionData?.testcases
                    ? Object.entries(submissionData?.testcases).map(([key, isPass]) => (
                        <Chip
                          startContent={isPass ? <Check size={15} /> : <X size={15} />}
                          size="sm"
                          color={isPass ? "success" : "danger"}
                          variant="flat"
                          key={`${key}-${isPass}`}
                        >
                          {isPass ? "Passed" : "Failed"}
                        </Chip>
                      ))
                    : question?.testcases && question.submission
                    ? question.testcases.map((testcase: any) => (
                        <Chip startContent={<Check size={15} />} size="sm" color="success" variant="flat" key={testcase.id}>
                          Passed
                        </Chip>
                      ))
                    : null}
                </div>
                <Button isLoading={isCreatingSubmission} disabled={isSubmitted} color="primary" variant="flat" onClick={handleSubmission}>
                  {isSubmitted ? (
                    <>
                      <CheckCircle /> Submitted
                    </>
                  ) : (
                    <>{!isCreatingSubmission ? <PlayCircle /> : null} Run & Submit</>
                  )}
                </Button>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </>
  );
};

export default useProtected(AttemptQuestionPage);
