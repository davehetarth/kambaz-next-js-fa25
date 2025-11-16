"use client";
import { useParams } from "next/navigation";
import ModulesControls from "./ModulesControls";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { FormControl } from "react-bootstrap";
import { useState } from "react";
import * as client from "../../client";
import {
  addModule,
  editModule,
  updateModule,
  deleteModule,
  setModules,
} from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../(Kambaz)/store";
import { useEffect } from "react";

interface Lesson {
  _id: string;
  name: string;
  description: string;
  module: string;
}

export interface Module {
  _id: string;
  name: string;
  course: string;
  editing?: boolean; // Added by the reducer, so make it optional
  lessons?: Lesson[]; // Not all modules may have lessons
}

export default function Modules() {
  const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModules();
  }, []);

  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const dispatch = useDispatch();
  const onCreateModuleForCourse = async () => {
    if (cid && typeof cid === "string") {
      const newModule = { name: moduleName, course: cid };
      const createdModule = await client.createModuleForCourse(cid, newModule);
      dispatch(setModules([...modules, createdModule]));
    }
  };

  const onRemoveModule = async (moduleId: string) => {
    await client.deleteModule(moduleId);
    dispatch(setModules(modules.filter((m: Module) => m._id !== moduleId)));
  };

  const onUpdateModule = async (module: Module) => {
    await client.updateModule(module);
    const newModules = modules.map((m: Module) =>
      m._id === module._id ? module : m
    );
    dispatch(setModules(newModules));
  };

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const canEdit = currentUser?.role === "FACULTY";
  return (
    <div className="me-5">
      {canEdit && (
        <>
          <ModulesControls
            setModuleName={setModuleName}
            moduleName={moduleName}
            addModule={onCreateModuleForCourse}
          />{" "}
          <br />
          <br />
          <br />
          <br />
        </>
      )}
      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          // .filter((module) => module.course === cid)
          .map((module) => (
            <ListGroupItem
              key={module._id}
              className="wd-module p-0 mb-5 fs-5 border-gray"
            >
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />{" "}
                {!module.editing && module.name}
                {module.editing && (
                  <FormControl
                    className="w-50 d-inline-block"
                    onChange={(e) =>
                      dispatch(
                        updateModule({ ...module, name: e.target.value })
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onUpdateModule({ ...module, editing: false });
                      }
                    }}
                    defaultValue={module.name}
                  />
                )}
                {canEdit && (
                  <ModuleControlButtons
                    moduleId={module._id}
                    deleteModule={(moduleId) => onRemoveModule(moduleId)}
                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                  />
                )}
              </div>
              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson) => (
                    <ListGroupItem
                      key={lesson._id}
                      className="wd-lesson p-3 ps-1"
                    >
                      <BsGripVertical className="me-2 fs-3" />
                      {lesson.name}
                      {canEdit && <LessonControlButtons />}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}
